import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef, Input, forwardRef, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Acesso } from 'src/app/core/acesso';
import { LoadingPopupService } from 'src/app/services/loadingPopup/loading-popup.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import * as _ from 'lodash';
import { FuncoesUteisService } from 'src/app/services/commons/funcoes-uteis.service';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { TitularService } from 'src/app/services/titular/titular.service';
import { Titular } from 'src/app/core/titular';
import { ControlContainer, NgForm, NgModelGroup } from '@angular/forms';
import { Settings } from 'src/app/app.settings.model';
import { TipoPlano } from 'src/app/core/tipo-plano';
import { RetornoPagamento } from 'src/app/services/pagseguro/retorno-pagamento';
import { CheckoutTransparenteBoleto, PagamentoBoletoSplitService } from 'src/app/services/pagseguro/split/pagamento-boleto-split.service';
import { CheckoutTransparenteCartaoCredito, PagamentoCartaoCreditoSplitService } from 'src/app/services/pagseguro/split/pagamento-cartao-credito-split.service';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MediaMatcher } from '@angular/cdk/layout';
import { AppSettings } from 'src/app/app.settings';
import { TipoPlanoService } from 'src/app/services/tipo-plano/tipo-plano.service';
import { EnderecoService } from 'src/app/services/endereco/endereco.service';
import { SessaoSplitService } from 'src/app/services/pagseguro/split/sessao-split.service';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { BandeiraSplitService } from 'src/app/services/pagseguro/split/bandeira-split.service';
import { ParansTokenCartao, TokenCartaoSplitService } from 'src/app/services/pagseguro/split/token-cartao-split.service';
import { NotificacaoTransacao } from 'src/app/services/pagseguro/notificacao-transacao';
import { NotificacaoTransacalSplitService } from 'src/app/services/pagseguro/split/notificacao-transacao-split.service';
import { HistoricoPagamentoService } from 'src/app/services/historico-pagamento/historico-pagamento.service';
import { HistoricoPagamento } from 'src/app/core/historico-pagamento';
import { HistoricoPagamentoBuilder } from 'src/app/services/builder/historico-pagamento-builder';
import { BroadcastEventService } from 'src/app/services/broadcast-event/broadcast-event.service';
import { VoucherService } from 'src/app/services/voucher/voucher.service';
import { AssinaturaPlanoRecorrenciaPagarmeService, NovaAssinaturaPlano } from 'src/app/services/pagarme/recorrencia/assinatura-plano-recorrencia-pagarme.service';
import { ClienteRecorrenciaPagarmeService } from 'src/app/services/pagarme/recorrencia/cliente-recorrencia-pagarme.service';
import { CartaoClienteRecorrenciaPagarmeService } from 'src/app/services/pagarme/recorrencia/cartao-cliente-recorrencia-pagarme.service';
import { CartaoClientePagarme } from 'src/app/services/pagarme/cartao-cliente-pagarme';
import { CriarCartaoCliente } from 'src/app/services/pagarme/criar-cartao-cliente';
import { ParansTokenCartaoPagarme } from 'src/app/services/pagarme/parans-token-cartao-pagarme';
import { NotificacaoTransacaoRecorrenciaPagarmeService } from 'src/app/services/pagarme/recorrencia/notificacao-transacao-recorrencia-pagarme.service';
import { ListaCartaoClientePagarme } from 'src/app/services/pagarme/lista-cartao-cliente-pagarme';
import { ClientePagarme } from 'src/app/services/pagarme/cliente-pagarme';


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
  selector: 'renovar-assinatura',
  templateUrl: './renovar-assinatura.component.html',
  styleUrls: ['./renovar-assinatura.component.css'], 
  viewProviders:  [
    { provide:  ControlContainer, useExisting:  NgForm },
    { provide: ControlContainer, useExisting: forwardRef(() => NgModelGroup) }
  ],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }],
  encapsulation: ViewEncapsulation.None 
})
export class RenovarAssinaturaComponent implements OnInit {
  
  @ViewChild('formulario') formulario;
  @ViewChild('stepper') stepper;

  @Input() titular: Titular;
  @Input() historicoPagamentos = [];
  @Input() perfilAcesso: Acesso;


  maskCNPJ = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  maskPhone = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  maskCelular = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  mascaraCpf = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/,];
  public maskCartao  = [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/,/\d/, ' ', /\d/, /\d/, /\d/, /\d/]; 

  meses = ['01','02','03','04','05','06','07','08','09','10','11','12'];

  public settings: Settings;
  
  tipoPlanos: TipoPlano[] = [];
  planoEscolhido: TipoPlano;
  idTipoPlanoEscolhido          = "";
  idTipoPagamentoEscolhido      = null;

  iniciarPagamento = false;

  isPodeUtilizarVoucherNoPagamento = true;
  isVoucher100Porcento = true;
  valorVoucher = null;

  aceitoAssinatiraCartaoAmigo = false;

  codigoCorretor: string;
  codigoCupom: string;
  dadosCartaoCredito: DadosCartaoCredito;


  retornoPagamento: any;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  ufs: any[] =[
    {nome:  'DF'}
  ]

  constructor(private dataUtilService: DataUtilService,
              public titularService: TitularService,
              private drc: ChangeDetectorRef,
              private loadingPopupService: LoadingPopupService,
              private toastService: ToastService,              
              private funcoesUteisService: FuncoesUteisService,
              private historicoPagamentoService: HistoricoPagamentoService,
              private historicoPagamentoBuilder: HistoricoPagamentoBuilder,
              changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              public appSettings: AppSettings,
              private tipoPlanoService: TipoPlanoService,
              private enderecoService: EnderecoService,

              private assinaturaPlanoRecorrenciaPagarmeService: AssinaturaPlanoRecorrenciaPagarmeService,
              private cartaoClienteRecorrenciaPagarmeService: CartaoClienteRecorrenciaPagarmeService,
              private notificacaoTransacaoRecorrenciaPagarmeService: NotificacaoTransacaoRecorrenciaPagarmeService,
              
              private voucherService: VoucherService
              ) {
    this.settings = this.appSettings.settings; 

    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);                 
  }


  ngOnInit() {
    this.planoEscolhido = new TipoPlano();
    this.dadosCartaoCredito = new DadosCartaoCredito();
    this.retornoPagamento   = new RetornoPagamento();    

    this.tipoPlanoService.getAllAtivos().subscribe((tipos: TipoPlano[]) => {
      this.tipoPlanos = tipos;

      if(this.idTipoPlanoEscolhido) {
        this.planoEscolhido = this.tipoPlanos.find(tp => tp.id === Number(this.idTipoPlanoEscolhido));
      }
    });

    this.enderecoService.getAllEstados().subscribe((ufs: any)=> {
      this.ufs = ufs;
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

  ngOnChanges(changes: SimpleChanges): void {
  }

  isMobile(): boolean {
    return this.mobileQuery.matches;
  }

  isNotMobile(): boolean {
    return !this.mobileQuery.matches;
  }

  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }
  
  realizarPagamentoBoleto() {
    this.loadingPopupService.mostrarMensagemDialog('Iniciando ....');

    const novaAssinaturaPlano = new NovaAssinaturaPlano();
    novaAssinaturaPlano.plan_id         = this.planoEscolhido.idPlanoPagarme;
    novaAssinaturaPlano.idPlano         = this.planoEscolhido.id;
    novaAssinaturaPlano.customer_id     = this.titular.idClientePagarMe;
    novaAssinaturaPlano.codigoCorretor  = this.codigoCorretor;
    novaAssinaturaPlano.voucher         = this.codigoCupom;
    novaAssinaturaPlano.idTitular       = this.titular.id;


    this.loadingPopupService.mostrarMensagemDialog('Processando pagamento....');
    this.assinaturaPlanoRecorrenciaPagarmeService.criarAssinaturaBoleto(novaAssinaturaPlano).pipe(
      catchError((retornoPagamento: any) => {
        this.loadingPopupService.closeDialog();
        return of(null);
      }),
      tap((retornoPagamento: any) => {
        this.abrirBoleto(retornoPagamento);
        this.retornoPagamento = retornoPagamento;
      }),
      switchMap((retornoPagamento: any) => {
        if(retornoPagamento && !_.isEmpty(retornoPagamento.id)) {
          return this.notificacaoTransacaoRecorrenciaPagarmeService.buscarDadosNotificacao(retornoPagamento.id);
        } else {
          return new Observable(obs => obs.next()); 
        }            
      }),

    ).subscribe((retornoNotificacao: NotificacaoTransacao) => {
      if(retornoNotificacao && retornoNotificacao.status) {
        this.retornoPagamento.status                   = String(retornoNotificacao.status.codigoTransacao);
        this.retornoPagamento.descricaoStatusTransacao = retornoNotificacao.status.descricao;

        this.historicoPagamentoService.getPagamentoByTitular(this.titular.id)
        .subscribe((historicoPagamento: HistoricoPagamento[]) =>{
          this.historicoPagamentos = historicoPagamento || [];
          if(!_.isEmpty(this.historicoPagamentos)) {
            this.historicoPagamentos = this.historicoPagamentos.map(h => this.historicoPagamentoBuilder.build(h));
          }
        });
      }
      
      BroadcastEventService.get('PAGAMENTO_REALIZADO').emit(true);
      this.loadingPopupService.closeDialog();
    }).add( () => this.loadingPopupService.closeDialog() );    

  }

  realizarPagamentoCartao() {
    this.loadingPopupService.mostrarMensagemDialog('Iniciando ....');

    //buscar os id do plano
    if(this.idTipoPlanoEscolhido) {
      this.planoEscolhido = this.tipoPlanos.find(tp => tp.id === Number(this.idTipoPlanoEscolhido));
    }

    //buscar os cartões cadastrados do cliente
    this.cartaoClienteRecorrenciaPagarmeService.listarCartoesCliente(this.titular.idClientePagarMe)
    .pipe(
      //verificar se o cartão informado pelo associado já está cadastrado        
      switchMap((cartoes: ListaCartaoClientePagarme) => {
        const numeroCartao      = this.funcoesUteisService.getApenasNumeros(this.dadosCartaoCredito.numeroCartao);
        const primeiros6digitos = numeroCartao.substring(0,6);
        const ultimos6digitos   = numeroCartao.substring(numeroCartao.length - 6);

        const cartaoEncontrado = cartoes.data.find( cartao => cartao.first_six_digits === primeiros6digitos && cartao.last_four_digits === ultimos6digitos);

        //se cartão não está cadastrado, então cadastra o cartão
        if(!cartaoEncontrado) {
          const novoCartaoCliente = new CriarCartaoCliente();
          novoCartaoCliente.number          = numeroCartao;
          novoCartaoCliente.holder_name     = this.dadosCartaoCredito.nomeImpressoCartao;
          novoCartaoCliente.holder_document = this.dadosCartaoCredito.cpfTitularCartao;
          novoCartaoCliente.exp_month       = Number(this.dadosCartaoCredito.mesValidade);
          novoCartaoCliente.exp_year        = Number(this.dadosCartaoCredito.anoValidade);
          novoCartaoCliente.cvv             = this.dadosCartaoCredito.cvv;
          novoCartaoCliente.customer        = new ClientePagarme();
          novoCartaoCliente.customer.id     = this.titular.idClientePagarMe;

          return this.cartaoClienteRecorrenciaPagarmeService.criarCartao(novoCartaoCliente);
        } else {
          return of(cartaoEncontrado); 
        }            
      }),

      //busca o token do cartão        
      switchMap((cartao: CartaoClientePagarme) => {
        const tokenCartao = new ParansTokenCartaoPagarme();
        tokenCartao.numeroCartao        = this.funcoesUteisService.getApenasNumeros(this.dadosCartaoCredito.numeroCartao);
        tokenCartao.nomeImpresso        = this.dadosCartaoCredito.nomeImpressoCartao;
        tokenCartao.cvv                 = this.dadosCartaoCredito.cvv;
        tokenCartao.mesVencimentoCartao = String(cartao.exp_month);
        tokenCartao.anoVencimentoCartao = String(cartao.exp_year);

        return this.cartaoClienteRecorrenciaPagarmeService.gerarTokenCartao(tokenCartao);        
      }),


      //Realiza a assinatura do plano
      switchMap((token: any) => {
        this.loadingPopupService.mostrarMensagemDialog('Processando pagamento....');

        const novaAssinaturaPlano = new NovaAssinaturaPlano();
        novaAssinaturaPlano.plan_id         = this.planoEscolhido.idPlanoPagarme;
        novaAssinaturaPlano.idPlano         = this.planoEscolhido.id;
        novaAssinaturaPlano.customer_id     = this.titular.idClientePagarMe;
        novaAssinaturaPlano.card_token      = token.id;
        novaAssinaturaPlano.codigoCorretor  = this.codigoCorretor;
        novaAssinaturaPlano.voucher         = this.codigoCupom;
        novaAssinaturaPlano.idTitular       = this.titular.id;

        return this.assinaturaPlanoRecorrenciaPagarmeService.criarAssinaturaCartao(novaAssinaturaPlano)
            .pipe(
              catchError((retornoPagamento: any) => {
                this.loadingPopupService.closeDialog();
                return of(null);
            }));       
      }),

      tap((retornoPagamento: any) => {
        this.retornoPagamento = retornoPagamento;
      }),

      switchMap((retornoPagamento: any) => {
        if(retornoPagamento && !_.isEmpty(retornoPagamento.id)) {
          return this.notificacaoTransacaoRecorrenciaPagarmeService.buscarDadosNotificacao(retornoPagamento.id);
        } else {
          return new Observable(obs => obs.next()); 
        }            
      }),

    ).subscribe((retornoNotificacao: NotificacaoTransacao) => {
      if(retornoNotificacao && retornoNotificacao.status) {
        this.retornoPagamento.status                   = String(retornoNotificacao.status.codigoTransacao);
        this.retornoPagamento.descricaoStatusTransacao = retornoNotificacao.status.descricao;

        this.historicoPagamentoService.getPagamentoByTitular(this.titular.id)
        .subscribe((historicoPagamento: HistoricoPagamento[]) =>{
          this.historicoPagamentos = historicoPagamento || [];
          if(!_.isEmpty(this.historicoPagamentos)) {
            this.historicoPagamentos = this.historicoPagamentos.map(h => this.historicoPagamentoBuilder.build(h));
          }
        });            
      }

      BroadcastEventService.get('PAGAMENTO_REALIZADO').emit(true);
      this.loadingPopupService.closeDialog();
    }).add( () => this.loadingPopupService.closeDialog() );
    
  }

  private abrirBoleto(retornoPagamento: RetornoPagamento) {
    if(retornoPagamento && retornoPagamento.linkPagamento) {
      window.open(retornoPagamento.linkPagamento, '_blank');
    }
  }
  
  getPlanoEscolhido(tipo) {
    this.idTipoPlanoEscolhido = String(tipo);
    this.planoEscolhido = this.tipoPlanos.find(tp => tp.id === Number(this.idTipoPlanoEscolhido));
  }

  tipoPagamentoEscolhido(tipo) {
    this.idTipoPagamentoEscolhido = String(tipo);
  }

  carregarTipoPagamentoEscolhido($event){
    this.idTipoPagamentoEscolhido = $event.value;
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

  carregarTipoPlanaEscolhido($event){
    this.idTipoPlanoEscolhido = $event.value;
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


  iniciarPagamentoAssinatura() {
    this.iniciarPagamento = true;
  }

  cancelarPagamento(stepper){
    stepper.reset();
    this.iniciarPagamento = false;

    this.novoPagamento();
  }


  isPermissaoApenasConsulta() {
    return this.perfilAcesso.consulta && !this.perfilAcesso.altera && !this.perfilAcesso.deleta && !this.perfilAcesso.insere;
  }

  novoPagamento() {
    this.retornoPagamento   = new RetornoPagamento(); 
    this.dadosCartaoCredito = new DadosCartaoCredito();
    this.iniciarPagamento              = true;
    this.codigoCupom                   = null;
    this.codigoCorretor                = null;
    this.idTipoPlanoEscolhido          = "";
    this.idTipoPagamentoEscolhido      = null;
    this.aceitoAssinatiraCartaoAmigo   = false;
  }


  isEtapaPreenchimentoDadosCartao(){
    return this.idTipoPagamentoEscolhido === '2' 
        && this.isPodeUtilizarVoucherNoPagamento 
        && !this.isVoucher100Porcento;
  }

  isEtapaResumo(){
    return this.isPodeUtilizarVoucherNoPagamento;
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

  linkTermoDeUso(){
    return 'https://s3.amazonaws.com/cartaoamigo.com.br/documentos/Termo+de+Uso.pdf';
  }

  habilitarBotao(formulario) {
    return formulario.valid
  }

  desabilitarBotao(formulario) {
    return formulario.invalid
  }
}