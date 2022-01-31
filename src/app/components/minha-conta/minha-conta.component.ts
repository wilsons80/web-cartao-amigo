import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { switchMap, tap } from 'rxjs/operators';
import { AppSettings } from 'src/app/app.settings';
import { Settings } from 'src/app/app.settings.model';
import { Acesso } from 'src/app/core/acesso';
import { Associados } from 'src/app/core/associados';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';
import { HistoricoPagamento } from 'src/app/core/historico-pagamento';
import { PessoaFisica } from 'src/app/core/pessoa-fisica';
import { Titular } from 'src/app/core/titular';
import { HistoricoPagamentoBuilder } from 'src/app/services/builder/historico-pagamento-builder';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { FuncoesUteisService } from 'src/app/services/commons/funcoes-uteis.service';
import { HistoricoPagamentoService } from 'src/app/services/historico-pagamento/historico-pagamento.service';
import { LoadingPopupService } from 'src/app/services/loadingPopup/loading-popup.service';
import { SessaoService } from 'src/app/services/sessao/sessao.service';
import { TitularService } from 'src/app/services/titular/titular.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { AutenticadorService } from 'src/app/services/autenticador/autenticador.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ProcedimentoAssociadoClinicaService } from 'src/app/services/procedimento-associado-clinica/procedimento-associado-clinica.service';
import { ProcedimentoAssociadoClinicaDto } from 'src/app/core/procedimento-associado-clinica-dto';
import { AssinaturasService } from 'src/app/services/assinaturas/assinaturas.service';
import { Assinaturas } from 'src/app/core/assinaturas';
import { CartaoClienteRecorrenciaPagarmeService } from 'src/app/services/pagarme/recorrencia/cartao-cliente-recorrencia-pagarme.service';
import { CartaoClientePagarme } from 'src/app/services/pagarme/cartao-cliente-pagarme';
import { BroadcastEventService } from 'src/app/services/broadcast-event/broadcast-event.service';


@Component({
  selector: 'minha-conta',
  templateUrl: './minha-conta.component.html',
  styleUrls: ['./minha-conta.component.scss'],
  providers:[SessaoService]
})
export class MinhaContaComponent implements OnInit {

  loadingComplete = false;

  @ViewChild('formulario') formulario;

  maskCNPJ = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  maskPhone = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  maskCelular = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  mascaraCpf = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/,];

  hide = true;
  isAtualizar = false;
  showBotaoSalvar = true;

  minDate = new Date();
  associado: Associados;

  titular: Titular;
  historicoPagamentos: HistoricoPagamento[];
  procedimentos: ProcedimentoAssociadoClinicaDto[];
  assinaturaAtiva:Assinaturas;
  cartoes: CartaoClientePagarme[];

  sim_nao: any[] = [
    {tipo: 'Sim', flag: 'S'},
    {tipo: 'Não', flag: 'N'}
  ];  

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil  = new CarregarPerfil(); 

  public settings: Settings;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(public appSettings:AppSettings,
              private dataUtilService: DataUtilService,
              public titularService: TitularService,
              private historicoPagamentoService: HistoricoPagamentoService,
              private drc: ChangeDetectorRef,
              changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              private activatedRoute: ActivatedRoute,
              private loadingPopupService: LoadingPopupService,
              private historicoPagamentoBuilder: HistoricoPagamentoBuilder,
              private toastService: ToastService,
              public sessaoService: SessaoService,
              private assinaturasService: AssinaturasService,
              private procedimentoAssociadoClinicaService: ProcedimentoAssociadoClinicaService,
              private cartaoClienteRecorrenciaPagarmeService: CartaoClienteRecorrenciaPagarmeService,
              public autenticadorService: AutenticadorService,
              private funcoesUteisService: FuncoesUteisService) {
    this.carregarPerfil = new CarregarPerfil();                
    this.settings = this.appSettings.settings;

    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);               
  }

  ngOnInit() {
    this.carregarPerfil.carregar(this.activatedRoute.snapshot.data.perfilAcesso, this.perfilAcesso);

    this.titular = new Titular();
    this.titular.pessoaFisica = new PessoaFisica();
    this.titular.dependentes = [];
    this.historicoPagamentos = null;

    this.onCarregarDadosTitular();

    BroadcastEventService.get('ATUALIZAR_HISTORICO_PAGAMENTO').subscribe((valor) => {
      this.onCarregarHistoricoPagamento();
    })
  }


  onCarregarDadosTitular() {
    setTimeout(() => {
      if(this.autenticadorService?.usuarioLogado?.idUsuario) {
        this.isAtualizar = true;
  
        this.loadingPopupService.mostrarMensagemDialog('Buscando, aguarde....');
        this.titularService.getByIdUsuario(this.autenticadorService.usuarioLogado.idUsuario).pipe(
          tap((titular: Titular) => {
            this.titular = titular;
            this.titular.pessoaFisica.cpf  = this.funcoesUteisService.getApenasNumeros(this.titular.pessoaFisica.cpf)
            this.titular.dependentes.forEach(d => d.pessoaFisica.cpf  = this.funcoesUteisService.getApenasNumeros(d.pessoaFisica.cpf));
          }),
          switchMap((titular: Titular) => {
            return this.historicoPagamentoService.getPagamentoByTitular(titular.id);
          }),
          tap((historicoPagamento: HistoricoPagamento[]) => {
            this.historicoPagamentos = historicoPagamento || [];
            if(!_.isEmpty(this.historicoPagamentos)) {
              this.historicoPagamentos = this.historicoPagamentos.map(h => this.historicoPagamentoBuilder.build(h));
            }
          }),
          switchMap(() => {
            return this.cartaoClienteRecorrenciaPagarmeService.listarCartoesCliente(this.titular.idClientePagarMe);
          }),
          tap((cartoes: CartaoClientePagarme[]) => {
            this.cartoes = cartoes;
          }),
          switchMap(() => {
            return this.procedimentoAssociadoClinicaService.getAllTitular(this.titular.id);
          }),
        ).subscribe((procedimentos: ProcedimentoAssociadoClinicaDto[]) =>{
          this.procedimentos = procedimentos || [];
          this.loadingComplete = true;
        }).add( () => {
          this.loadingPopupService.closeDialog(); 
        });
      }
    }, 10);
  }

  ngAfterViewInit() {
  }

  ngAfterContentChecked(): void {
    this.drc.detectChanges();
  }

  salvar() {
    this.formatar();
    this.atualizar();
  }

  formatar() {
    this.titular.pessoaFisica.cep = this.funcoesUteisService.getApenasNumeros(this.titular?.pessoaFisica?.cep);
    this.titular.pessoaFisica.celular = this.funcoesUteisService.getApenasNumeros(this.titular?.pessoaFisica?.celular);
    this.titular.pessoaFisica.cpf = this.titular.pessoaFisica.cpf ? this.funcoesUteisService.getApenasNumeros(this.titular.pessoaFisica.cpf.toString()) : null;

    if(!_.isEmpty(this.titular.dependentes)){
      this.titular.dependentes.forEach(d => {
        d.pessoaFisica.cep = this.funcoesUteisService.getApenasNumeros(d.pessoaFisica?.cep);
        d.pessoaFisica.celular = this.funcoesUteisService.getApenasNumeros(d.pessoaFisica?.celular);
        d.pessoaFisica.cpf  = this.funcoesUteisService.getApenasNumeros(d.pessoaFisica.cpf);
      }) 
    }
  }



  private atualizar(){
    this.loadingPopupService.mostrarMensagemDialog('Processando, aguarde...');
    this.titularService.alterar(this.titular).subscribe((titular: Titular) => {
      this.titular = titular;
      this.formatar();
      this.toastService.showSucesso('Operação realizada com sucesso.')
    },
    (error) => {      
    }).add( () => this.loadingPopupService.closeDialog()  );
  }

  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }


  tabChange(evento: MatTabChangeEvent) {
    if(evento.index === 2 || evento.index === 3 || evento.index === 4 || evento.index === 5) {
      this.showBotaoSalvar = false;
    } else {
      this.showBotaoSalvar = true;
    }

    // Histórico pagamento
    if(evento.index === 3) {
      this.onCarregarHistoricoPagamento();
    }
    
  }

  private onCarregarHistoricoPagamento() {
    if(this.titular?.id) {
      this.loadingPopupService.mostrarMensagemDialog('Aguarde....');

      this.assinaturasService.getAssinaturaAtivaDoTitular(this.titular?.id)
      .pipe(
        tap((assinaturaAtiva: Assinaturas) => {
          this.assinaturaAtiva = assinaturaAtiva;
        }),
        switchMap(() => {
          return this.historicoPagamentoService.getPagamentoByTitular(this.titular.id)
        }),
      )
      .subscribe((historicoPagamento: HistoricoPagamento[]) => {
        this.historicoPagamentos = historicoPagamento || [];
        if(!_.isEmpty(this.historicoPagamentos)) {
          this.historicoPagamentos = this.historicoPagamentos.map(h => this.historicoPagamentoBuilder.build(h));
        }
      }).add(() => this.loadingPopupService.closeDialog() )
    }
  }


  isPermissaoApenasConsulta() {
    return this.perfilAcesso.consulta && !this.perfilAcesso.altera && !this.perfilAcesso.deleta && !this.perfilAcesso.insere;
  }
}
