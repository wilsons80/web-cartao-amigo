import { MediaMatcher } from '@angular/cdk/layout';
import { StepperSelectionEvent, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { AfterContentChecked, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppSettings } from 'src/app/app.settings';
import { Settings } from 'src/app/app.settings.model';
import { PessoaFisica } from 'src/app/core/pessoa-fisica';
import { Titular } from 'src/app/core/titular';
import { FuncoesUteisService } from 'src/app/services/commons/funcoes-uteis.service';
import { ContaAssociadoService } from 'src/app/services/conta-associado/conta-associado.service';
import { LoadingPopupService } from 'src/app/services/loadingPopup/loading-popup.service';
import { CheckoutTransparenteBoleto} from 'src/app/services/pagseguro/split/pagamento-boleto-split.service';
import { CheckoutTransparenteCartaoCredito } from 'src/app/services/pagseguro/split/pagamento-cartao-credito-split.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { SessaoSplitService } from 'src/app/services/pagseguro/split/sessao-split.service';
import { NotificacaoTransacalSplitService } from 'src/app/services/pagseguro/split/notificacao-transacao-split.service';
import { BandeiraSplitService } from 'src/app/services/pagseguro/split/bandeira-split.service';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { PagamentoBoletoSplitService } from 'src/app/services/pagseguro/split/pagamento-boleto-split.service';
import { PagamentoCartaoCreditoSplitService } from 'src/app/services/pagseguro/split/pagamento-cartao-credito-split.service';
import { ParansTokenCartao, TokenCartaoSplitService } from 'src/app/services/pagseguro/split/token-cartao-split.service';
import { TipoPlanoService } from 'src/app/services/tipo-plano/tipo-plano.service';
import { TipoPlano } from 'src/app/core/tipo-plano';
import { RetornoPagamento } from 'src/app/services/pagseguro/retorno-pagamento';
import { NotificacaoTransacao } from 'src/app/services/pagseguro/notificacao-transacao';
import { ActivatedRoute, Router } from '@angular/router';
import { TitularService } from 'src/app/services/titular/titular.service';
import { EnderecoService } from 'src/app/services/endereco/endereco.service';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import * as _ from 'lodash';
import { DependenteTitularService } from 'src/app/services/dependente-titular/dependente-titular.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { VoucherService } from 'src/app/services/voucher/voucher.service';
import { CorretorService } from 'src/app/services/corretor/corretor.service';
import { Corretor } from 'src/app/core/corretor';

class DadosCartaoCredito {
   numeroCartao: string;
   mesValidade: string;
   anoValidade: string;
   cvv: string;
   nomeImpressoCartao: string;
   cpfTitularCartao: string;
   dataNascimentoTitularCartao: Date; 
}

declare var PagSeguroDirectPayment: any;
declare var window: any;
declare var document: any;
declare var InstallTrigger: any;

@Component({
  selector: 'formulario-associado',
  templateUrl: './formulario-associado.component.html',
  styleUrls: ['./formulario-associado.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }],
  encapsulation: ViewEncapsulation.None
})
export class FormularioAssociadoComponent implements OnInit, AfterContentChecked {

  @ViewChild('formulario') formulario;
  @ViewChild('stepper') stepper;

  obrigatorio = true;
  isTokenCorretorValido = true;
  
  titular: Titular = new Titular();
  error: any;
  hideSenha = true;
  hideConfirmeSenha = true;
  isTitularNovoNoSistema = false;

  senha1: string;
  senha2: string;
  senhaValida: string;

  public maskCelular = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public mascaraCpf  = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  public maskCartao  = [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/,/\d/, ' ', /\d/, /\d/, /\d/, /\d/]; 
  public maskCep     = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];

  meses = ['01','02','03','04','05','06','07','08','09','10','11','12'];

  public settings: Settings;
  
  tipoPlanos: TipoPlano[] = [];

  planoEscolhido: TipoPlano;
  idTipoPlanoEscolhido          = "";
  idTipoPagamentoEscolhido      = "";
  senderHash: string;

  isPodeUtilizarVoucherNoPagamento = true;
  isVoucher100Porcento = true;
  valorVoucher = null;

  aceitoAssinatiraCartaoAmigo = false;

  isInformarCodigoCorretor = true;
  codigoCorretor: string;
  codigoCupom: string;
  pagamentoCR: CheckoutTransparenteCartaoCredito;
  dadosCartaoCredito: DadosCartaoCredito;

  pagamentoBoleto: CheckoutTransparenteBoleto;
  dadosBoleto: any;

  retornoPagamento: RetornoPagamento;

  // Dados para realizar o pagamento com CARTÃO DE CRÉDITO
  idSessao: string;
  binTO: any;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  ufs: any[] =[
    {nome:  'DF'}
  ]

  constructor(
    public router: Router,
    public appSettings: AppSettings,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private loadingPopupService: LoadingPopupService,
    private dataUtilService: DataUtilService,
    private contaAssociadoService: ContaAssociadoService,
    private notificacaoTransacalSplitService: NotificacaoTransacalSplitService,
    private funcoesUteisService: FuncoesUteisService,
    private drc: ChangeDetectorRef,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private dialog: MatDialog,
    private tipoPlanoService: TipoPlanoService,
    private sessaoSplitService: SessaoSplitService,
    private bandeiraSplitService: BandeiraSplitService,
    private pagamentoCartaoCreditoSplitService: PagamentoCartaoCreditoSplitService,
    private pagamentoBoletoSplitService: PagamentoBoletoSplitService,
    private tokenCartaoSplitService: TokenCartaoSplitService,
    private enderecoService: EnderecoService,
    private dependenteTitularService: DependenteTitularService,
    private voucherService: VoucherService,
    private corretorService: CorretorService
  ) { 

    this.settings = this.appSettings.settings; 

    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);      
  }

  ngOnInit() {
    const tipoPlano = this.activatedRoute.snapshot.queryParams['plano'];
    if(tipoPlano === 'anual-avista')    {this.idTipoPlanoEscolhido = "1";}
    if(tipoPlano === 'mensal')          {this.idTipoPlanoEscolhido = "2";}
    if(tipoPlano === 'anual-parcelado') {this.idTipoPlanoEscolhido = "3";}


    const path = this.activatedRoute.snapshot.routeConfig.path;
    if(path.includes("pagamento")) {
      this.isInformarCodigoCorretor = false;
      
      const tokenCorretor = this.activatedRoute.snapshot.queryParams['token'];
      if(!!tokenCorretor) {
        this.corretorService.getByToken(tokenCorretor).subscribe((corretor: Corretor) => {
          this.codigoCorretor = corretor?.codigo;
          this.validarTokenCorretor(this.codigoCorretor);
        })
      } else {
        this.validarTokenCorretor(null);
      }
    }


    this.titular = new Titular();
    this.titular.pessoaFisica = new PessoaFisica();
    this.planoEscolhido = new TipoPlano();

    this.pagamentoCR = new CheckoutTransparenteCartaoCredito();
    this.dadosCartaoCredito = new DadosCartaoCredito();
    this.retornoPagamento = new RetornoPagamento();

    this.tipoPlanoService.getAllAtivos().subscribe((tipos: TipoPlano[]) => {
      this.tipoPlanos = tipos;

      if(this.idTipoPlanoEscolhido) {
        this.planoEscolhido = this.tipoPlanos.find(tp => tp.id === Number(this.idTipoPlanoEscolhido));
      }
    });

    this.enderecoService.getAllEstados().subscribe((ufs: any)=> {
      this.ufs = ufs;
    });

    this.sessaoSplitService.get().pipe(
      switchMap((sessao: any) => {
        return of(sessao);;
      })
    ).subscribe((sessao: any) => {
      this.idSessao = sessao.id;
    });


  }
  
  ngAfterViewInit(){
    setTimeout(() => {
      this.settings.loadingSpinner = false; 
    }); 
  }

  ngAfterContentChecked(): void {
    this.drc.detectChanges();
  }

  private validarTokenCorretor(token: string){
    if(!token) {
      this.toastService.showAlerta('Não é possível identificar o corretor para esse link de pagamento.');
      this.isTokenCorretorValido = false;
    }
  }

  isMobile(): boolean {
    return this.mobileQuery.matches;
  }

  isNotMobile(): boolean {
    return !this.mobileQuery.matches;
  }

  formatar() {
    this.titular.pessoaFisica.cep = this.funcoesUteisService.getApenasNumeros(this.titular?.pessoaFisica?.cep);
    this.titular.pessoaFisica.cpf = this.titular.pessoaFisica.cpf ? this.funcoesUteisService.getApenasNumeros(this.titular.pessoaFisica.cpf.toString()) : null
    this.titular.pessoaFisica.celular = this.titular.pessoaFisica.celular ? this.funcoesUteisService.getApenasNumeros(this.titular.pessoaFisica.celular.toString()) : null
  }


  buscaBandeira() {
    if(!this.dadosCartaoCredito.numeroCartao) {
      this.toastService.showAlerta('Informe os 16 dígitos do cartão de crédito.');
      return;
    }

    const numeroCartao = this.funcoesUteisService.getApenasNumeros(this.dadosCartaoCredito.numeroCartao);
    if(!numeroCartao || numeroCartao.length != 16) {
      this.toastService.showAlerta('O número do cartão deve ter 16 dígitos.');
      return;
    }

    const binCartao = numeroCartao.substring(0,6);
    this.bandeiraSplitService.get(this.idSessao, binCartao).subscribe((bandeira: any) => {
      if(bandeira.bin.statusMessage === 'Error') {
        this.toastService.showAlerta('O número do cartão está inválido.');
      } else {
        this.binTO = bandeira;
      }
    });
  }

  private preencherParansTokenCartao(): ParansTokenCartao {
    const parans = new ParansTokenCartao();
    parans.idSessao            = this.idSessao;
    parans.valor               = this.planoEscolhido.valor;
    parans.numeroCartao        = this.funcoesUteisService.getApenasNumeros(this.dadosCartaoCredito.numeroCartao);
    parans.bandeiraCartao      = this.binTO?.bin?.brand?.name;
    parans.cvv                 = this.dadosCartaoCredito.cvv;
    parans.mesVencimentoCartao = this.dadosCartaoCredito.mesValidade;
    parans.anoVencimentoCartao = this.dadosCartaoCredito.anoValidade;

    return parans;
  }

  isSenhasInformadasValidas(formularioEtapa1) {
    const isInvalida = this.senha1 && this.senha2 &&
                       (this.senha1 !== this.senha2) &&
                       formularioEtapa1.control?.controls?.senha?.touched &&
                       formularioEtapa1.control?.controls?.senhaConfirmada?.touched;


    this.senhaValida = isInvalida === true ? null : 'valida';
    return isInvalida;
  }


  cadastrarUsuario(){
    if(!this.titular.id) {
      this.formatar();    
      this.titular.dependentes = [];
      this.titular.ativo = true;  
      this.isTitularNovoNoSistema = false;
      this.titular.senha = this.senha1;
      this.titular.senhaConfirmada = this.senha2;
      this.titular.codigoCorretor = this.codigoCorretor;
  
      this.loadingPopupService.mostrarMensagemDialog('Aguarde....');
      this.contaAssociadoService.criarConta(this.titular).pipe(
        catchError((retorno: any) => {
          this.loadingPopupService.closeDialog();
          this.isTitularNovoNoSistema = false;
          return new Observable(obs => obs.next()); 
        })
      ).subscribe((titular: Titular) => {
        if(titular) {
          this.isTitularNovoNoSistema = true;
          this.titular = titular;
          setTimeout(() => this.stepper.next()) 
        }
      }).add(() => {this.loadingPopupService.closeDialog()})
    } else {
      this.loadingPopupService.closeDialog();
      this.stepper.next();
    }
  }

  realizarPagamentoBoleto() {
    this.loadingPopupService.mostrarMensagemDialog('Iniciando ....');
    return PagSeguroDirectPayment.onSenderHashReady(
      response => {
        if(!response || response.status == 'error') {
          this.toastService.showAlerta('Erro ao recuperar o sender hash, o pagamento não será realizado.');
          return false;
        }
        this.senderHash = response.senderHash;

        const dados = new CheckoutTransparenteBoleto();
        dados.idPlano         = Number(this.idTipoPlanoEscolhido);
        dados.cpfComprador    = this.funcoesUteisService.getApenasNumeros(this.titular.pessoaFisica.cpf);
        dados.codigoCorretor  = this.codigoCorretor;
        dados.senderHash      = this.senderHash;
        dados.voucher         = this.codigoCupom

        this.loadingPopupService.mostrarMensagemDialog('Processando pagamento....');
        return this.pagamentoBoletoSplitService.pagar(dados).pipe(
            catchError((retornoPagamento: RetornoPagamento) => {
              this.loadingPopupService.closeDialog();
              return of(null);
            }),
            tap((retornoPagamento: RetornoPagamento) => {
              this.abrirBoleto(retornoPagamento);
              this.retornoPagamento = retornoPagamento;
            }),
            switchMap((retornoPagamento: RetornoPagamento) => {
              if(retornoPagamento && !_.isEmpty(retornoPagamento.codigoTransacao)) {
                return this.notificacaoTransacalSplitService.buscarDadosNotificacao(retornoPagamento.codigoTransacao);
              } else {
                return new Observable(obs => obs.next()); 
              }            
            }),
        ).subscribe((retornoNotificacao: NotificacaoTransacao) => {
          if(retornoNotificacao && retornoNotificacao.status) {
            this.retornoPagamento.statusTransacao          = String(retornoNotificacao.status.codigoTransacao);
            this.retornoPagamento.descricaoStatusTransacao = retornoNotificacao.status.descricao;
          }
          this.loadingPopupService.closeDialog();
        }).add( () => this.loadingPopupService.closeDialog() );        
      }
    )
  }


  realizarPagamentoCartao() {
    this.loadingPopupService.mostrarMensagemDialog('Iniciando ....');
    return PagSeguroDirectPayment.onSenderHashReady(
      response => {
        if(!response || response.status == 'error') {
          this.toastService.showAlerta('Erro ao recuperar o sender hash, o pagamento não será realizado.');
          return false;
        }
        this.senderHash = response.senderHash;

        const parans = this.preencherParansTokenCartao();
        this.tokenCartaoSplitService.get(parans)
        .pipe(
          switchMap((tokenCartao: any) => {
            const dados = new CheckoutTransparenteCartaoCredito();
            dados.idPlano                       = Number(this.idTipoPlanoEscolhido);
            dados.cpfComprador                  = this.funcoesUteisService.getApenasNumeros(this.titular.pessoaFisica.cpf);
            dados.codigoCorretor                = this.codigoCorretor;
            dados.senderHash                    = this.senderHash;
            dados.tokenCartaoCredito            = tokenCartao.token;
            dados.voucher                       = this.codigoCupom;
            dados.idSessao                      = this.idSessao;
            dados.bandeiraCartao                = parans.bandeiraCartao;
            dados.nomeImpressoCartao            = this.dadosCartaoCredito.nomeImpressoCartao;
            dados.cpfTitularCartao              = this.funcoesUteisService.getApenasNumeros(this.dadosCartaoCredito.cpfTitularCartao);
            dados.dataNascimentoTitularCartao   = this.dadosCartaoCredito.dataNascimentoTitularCartao;

            this.loadingPopupService.mostrarMensagemDialog('Processando pagamento....');
            return this.pagamentoCartaoCreditoSplitService.pagar(dados)
                .pipe(
                  catchError((retornoPagamento: RetornoPagamento) => {
                  this.loadingPopupService.closeDialog();
                  return of(null);
                }));
          }),
          tap((retornoPagamento: RetornoPagamento) => {
            this.retornoPagamento = retornoPagamento;
          }),
          switchMap((retornoPagamento: RetornoPagamento) => {
            if(retornoPagamento && !_.isEmpty(retornoPagamento.codigoTransacao)) {
              return this.notificacaoTransacalSplitService.buscarDadosNotificacao(retornoPagamento.codigoTransacao);
            } else {
              return new Observable(obs => obs.next()); 
            }            
          })
        ).subscribe((retornoNotificacao: NotificacaoTransacao) => {
          if(retornoNotificacao && retornoNotificacao.status) {
            this.retornoPagamento.statusTransacao          = String(retornoNotificacao.status.codigoTransacao);
            this.retornoPagamento.descricaoStatusTransacao = retornoNotificacao.status.descricao;
          }
          this.loadingPopupService.closeDialog();

        }).add( () => this.loadingPopupService.closeDialog() );        
      }
    );
  }

  private abrirBoleto(retornoPagamento: RetornoPagamento) {
    if(retornoPagamento && retornoPagamento.linkPagamento) {
      window.open(retornoPagamento.linkPagamento, '_blank');
    }
  }

  linkTermoDeUso(){
    return 'https://s3.amazonaws.com/cartaoamigo.com.br/documentos/Termo+de+Uso.pdf';
  }

  getPlanoEscolhido(tipo) {
    this.idTipoPlanoEscolhido = String(tipo);
    this.planoEscolhido = this.tipoPlanos.find(tp => tp.id === Number(this.idTipoPlanoEscolhido));
  }

  tipoPagamentoEscolhido(tipo) {
    this.idTipoPagamentoEscolhido = String(tipo);

    // cartão de crédito
    if(this.idTipoPagamentoEscolhido === "2") {
      this.pagamentoCR = new CheckoutTransparenteCartaoCredito();
    }

    // boleto
    if(this.idTipoPagamentoEscolhido === "1") {
      this.pagamentoCR = new CheckoutTransparenteCartaoCredito();
    }

  }

  getLogoCartaoAmigo() {
    return '../../../assets/imagens/LOGO_CARTAO_AMIGO-V2.2.jpg';
  }

  getLogoCartaoAmigoSemFundo(){
    return '../../../assets/imagens/LOGO_CARTAO_AMIGO_SFUNDO1.png';
  }

  getImagemPlanoAnual() {
    return '../../../assets/imagens/plano-anual.png';
  }

  getImagemPlanoMensal() {
    return '../../../assets/imagens/plano-mensal.png';
  }

  getImagemBoleto() {
    return '../../../assets/imagens/boleto.jpg';
  }

  getImagemCartao() {
    return '../../../assets/imagens/cartao.jpeg';
  }

  getImagemCVV() {
    return '../../../assets/imagens/cvv.png';
  }

  getResumoCompraCartao() {
    if(this.binTO && this.binTO.bin && this.dadosCartaoCredito && this.dadosCartaoCredito.numeroCartao) {
      return 'CARTÃO DE CRÉDITO - ' + this.binTO.bin.brand.name.toUpperCase() + ' -  Final ' + this.dadosCartaoCredito.numeroCartao.substring(15);
    }
    return 'CARTÃO DE CRÉDITO';
  }


  enderecoBuilder(endereco) {
    if (endereco && endereco.sucesso) {
      this.titular.pessoaFisica.uf       = endereco.uf;
      this.titular.pessoaFisica.cidade   = endereco.localidade + ' ' + endereco.complemento;
      this.titular.pessoaFisica.bairro   = endereco.bairro;
      this.titular.pessoaFisica.endereco = endereco.logradouro;
    } else {
      this.titular.pessoaFisica.uf       = null;
      this.titular.pessoaFisica.cidade   = null;
      this.titular.pessoaFisica.bairro   = null;
      this.titular.pessoaFisica.endereco = null;
      this.toastService.showAlerta('Cep inexistente ou endereço não encontrado.');
    }
  }
  
  validaCep(cep) {
    const regex = /^\d{2}((?!000000).)*$/;
    return regex.test(cep);
  }

  onChangeCep() {
    if (this.titular.pessoaFisica.cep && this.validaCep(this.titular.pessoaFisica.cep)) {
      this.enderecoService.getEnderecoPorCep(this.titular.pessoaFisica.cep).subscribe(
          (dados) => {
            this.enderecoBuilder(dados);
          },
          (err) => {
            this.enderecoBuilder(null);
            this.toastService.showAlerta('Ocorreu um erro ao buscar o endereço.');
          }
        );
    }

  }

  carregarTipoPlanaEscolhido($event){
    this.idTipoPlanoEscolhido = $event.value;
  }

  carregarTipoPagamentoEscolhido($event){
    this.idTipoPagamentoEscolhido = $event.value;
  }

  private getTipoBrowser(){
    var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
   
    var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
    var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
   
    var isChrome = !!window.chrome && !isOpera;              // Chrome 1+
    var isIE = /*@cc_on!@*/false || !!document.documentMode;   // At least IE6
    if (isOpera) {
        return 1;
    }
    else if (isFirefox) {
        return 2;
    }
    else if (isChrome) {
        return 3;
    }
    else if (isSafari) {
        return 4;
    }
    else if (isIE) {
        return 5;
    }
    else {
        return 0;
    }
  }

  isSafari() {
    return this.getTipoBrowser() === 4;
  }

    
  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }

  onProcessar(evento: StepperSelectionEvent) {
    if( evento.selectedIndex === 1 ) {
      this.validarCadastroDependente();
    }
  }

  isEtapaPreenchimentoDadosCartao(){
    return this.isTitularNovoNoSistema 
        && this.isTipoPagamentoEscolhidoCartaoCredito() 
        && this.isPodeUtilizarVoucherNoPagamento 
        && !this.isVoucher100Porcento;
  }

  isEtapaResumo(){
    return this.isTitularNovoNoSistema 
        && this.isPodeUtilizarVoucherNoPagamento;
  }

  public validarVoucher() {
    this.isPodeUtilizarVoucherNoPagamento = false;
    this.isVoucher100Porcento             = false;
    this.valorVoucher                     = null;

    if(this.codigoCupom) {

      this.loadingPopupService.mostrarMensagemDialog('Validando voucher...');
      this.voucherService.getPorCodigo(this.codigoCupom).subscribe((voucher: any) => {
        if(!voucher.ativo) {
          this.toastService.showAlerta('Esse voucher não está ativo para uso.');
          this.isPodeUtilizarVoucherNoPagamento = false;
          return;
        }
  
        if(voucher.utilizado) {
          this.toastService.showAlerta('Esse voucher já foi utilizado.');
          this.isPodeUtilizarVoucherNoPagamento = false;
          return;
        }
  
        if(this.dataUtilService.isAnteriorHoje(voucher.dataValidade)) {
          this.toastService.showAlerta('Esse voucher já foi vencido.');
          this.isPodeUtilizarVoucherNoPagamento = false;
          return;
        }
  
        this.isPodeUtilizarVoucherNoPagamento = true;
        if(voucher.porcentagem >= 100) {
          this.isVoucher100Porcento = true;
        }

        this.valorVoucher = voucher.porcentagem;  
        this.loadingPopupService.closeDialog();

        if(this.isPodeUtilizarVoucherNoPagamento) {
          this.stepper.next();
        }
  
      }).add(() => this.loadingPopupService.closeDialog());
    } else {
      this.isPodeUtilizarVoucherNoPagamento = true;
      this.isVoucher100Porcento             = false;
      this.valorVoucher                     = null;  
      this.stepper.next();
    }

  }

  private validarCadastroDependente() {
    this.loadingPopupService.mostrarMensagemDialog('Processando...');
    this.dependenteTitularService.isJaDependente(this.titular.pessoaFisica.cpf)
    .subscribe((valor: boolean) => {
      if(valor === true) {
        this.loadingPopupService.closeDialog();
        this.chamaCaixaDialogoIsJaDependente();
      } else {
        this.cadastrarUsuario();        
      }
    });
  }

  chamaCaixaDialogoIsJaDependente() {    
    const textoAuxiliar = [];
    textoAuxiliar.push('Identificamos que você já um é um dependente.');
    textoAuxiliar.push('Ao clicar em SIM, seus dados serão apagados e você se tornará um titular.');
    textoAuxiliar.push('Essa ação é irreversível.');
    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: 'Deseja continuar ?',
      textoAuxiliar: textoAuxiliar,
      textoConfirma: 'SIM',
      textoCancela: 'NÃO'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        this.cadastrarUsuario();
      } else {
        dialogRef.close();
      }
    });
  }


  habilitarBotao(formularioEtapa1) {
    return formularioEtapa1.valid && !this.isSenhasInformadasValidas(formularioEtapa1)
  }

  desabilitarBotao(formularioEtapa1) {
    return formularioEtapa1.invalid || this.isSenhasInformadasValidas(formularioEtapa1)
  }

  isPlanoEscolhidoAnualAvista(): boolean {
    return this.idTipoPlanoEscolhido === '1';
  }
  isPlanoEscolhidoAnualParcelado(): boolean {
    return this.idTipoPlanoEscolhido === '3';
  }

  isTipoPagamentoEscolhidoBoleto(): boolean {
    return this.idTipoPagamentoEscolhido === '1';
  }
  isTipoPagamentoEscolhidoCartaoCredito(): boolean {
    return this.idTipoPagamentoEscolhido === '2';
  }

  
}
