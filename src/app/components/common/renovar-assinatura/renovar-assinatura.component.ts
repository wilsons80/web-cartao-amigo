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
  senderHash: string;

  iniciarPagamento = false;

  isPodeUtilizarVoucherNoPagamento = true;
  isVoucher100Porcento = true;
  valorVoucher = null;

  aceitoAssinatiraCartaoAmigo = false;

  // Dados do cartão


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
              private sessaoSplitService: SessaoSplitService,
              private bandeiraSplitService: BandeiraSplitService,
              private pagamentoCartaoCreditoSplitService: PagamentoCartaoCreditoSplitService,
              private pagamentoBoletoSplitService: PagamentoBoletoSplitService,
              private tokenCartaoSplitService: TokenCartaoSplitService,
              private notificacaoTransacalSplitService: NotificacaoTransacalSplitService,
              private voucherService: VoucherService
              ) {
    this.settings = this.appSettings.settings; 

    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);                 
  }


  ngOnInit() {
    this.planoEscolhido = new TipoPlano();

    this.pagamentoCR        = new CheckoutTransparenteCartaoCredito();
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
            dados.voucher                       = this.codigoCupom
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
          }),
        ).subscribe((retornoNotificacao: NotificacaoTransacao) => {
          if(retornoNotificacao && retornoNotificacao.status) {
            this.retornoPagamento.statusTransacao          = String(retornoNotificacao.status.codigoTransacao);
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
    );
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


  iniciarPagamentoAssinatura() {
    this.iniciarPagamento = true;
  }

  cancelarPagamento(stepper){
    stepper.reset();
    this.iniciarPagamento              = false;

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
    return this.isTipoPagamentoEscolhidoCartaoCredito()
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