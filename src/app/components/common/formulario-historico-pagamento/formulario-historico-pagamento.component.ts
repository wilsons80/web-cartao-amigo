import { Component, OnInit, ChangeDetectorRef, Input, forwardRef, ViewChild, SimpleChanges } from '@angular/core';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { ControlContainer, NgForm, NgModelGroup } from '@angular/forms';
import { HistoricoPagamento } from 'src/app/core/historico-pagamento';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MediaMatcher } from '@angular/cdk/layout';
import { ToastService } from 'src/app/services/toast/toast.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { AssinaturaPlanoRecorrenciaPagarmeService } from 'src/app/services/pagarme/recorrencia/assinatura-plano-recorrencia-pagarme.service';
import * as _ from 'lodash';
import { HistoricoPagamentoService } from 'src/app/services/historico-pagamento/historico-pagamento.service';
import { switchMap, tap } from 'rxjs/operators';
import { Assinaturas } from 'src/app/core/assinaturas';
import { HistoricoPagamentoBuilder } from 'src/app/services/builder/historico-pagamento-builder';
import { CarteiraCartaoPagamentoAssociado } from 'src/app/core/carteira-cartao-pagamento-associado';
import { FormaPagamentoEnum } from 'src/app/core/forma_pagamento_enum';
import { EditarCartaoAssinaturaPagarme } from 'src/app/services/pagarme/editar-cartao-assinatura-pagarme';
import { CartaoDialogComponent } from '../formulario-carteiras/cartao-dialog/cartao-dialog.component';
import { LoadingPopupService } from 'src/app/services/loadingPopup/loading-popup.service';
import { CartaoClientePagarme } from 'src/app/services/pagarme/cartao-cliente-pagarme';
import { MudarCartaoAssinaturaDialogComponent } from './mudar-cartao-assinatura-dialog/mudar-cartao-assinatura-dialog.component';
import { Acesso } from 'src/app/core/acesso';
import { BroadcastEventService } from 'src/app/services/broadcast-event/broadcast-event.service';

@Component({
  selector: 'formulario-historico-pagamento',
  templateUrl: './formulario-historico-pagamento.component.html',
  styleUrls: ['./formulario-historico-pagamento.component.css'], 
  viewProviders:  [
    { provide:  ControlContainer, useExisting:  NgForm },
    { provide: ControlContainer, useExisting: forwardRef(() => NgModelGroup) }
  ] 
})
export class FormularioHistoricoPagamentoComponent implements OnInit {

  @Input() historicoPagamentos: HistoricoPagamento[];
  @Input() ocultarColunas = false;
  @Input() assinaturaAtiva:Assinaturas;
  @Input() cartoes: CartaoClientePagarme[];
  @Input() perfilAcesso: Acesso;
  @Input() titular;

  @ViewChild(MatSort) sort: MatSort;

  mostrarTabela = false;

	mobileQuery: MediaQueryList;
	private _mobileQueryListener: () => void;

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  msg: string;
  
  
  constructor(private dataUtilService: DataUtilService,
              changeDetectorRef: ChangeDetectorRef,
              private toastService: ToastService,
              private dialog: MatDialog,
              private historicoPagamentoService: HistoricoPagamentoService,
              private historicoPagamentoBuilder: HistoricoPagamentoBuilder,
              private loadingPopupService: LoadingPopupService,
              private assinaturaPlanoRecorrenciaPagarmeService: AssinaturaPlanoRecorrenciaPagarmeService,
              media: MediaMatcher,
              private drc: ChangeDetectorRef,) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener); 
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.connect();
    this.onMostrarColunas();

    if (_.isEmpty(this.historicoPagamentos)) {
      this.mostrarTabela = false;
      this.msg = '';
      this.msg = 'Nenhum pagamento efetuado.';
    } else {                    
      this.mostrarTabela = true;
    }
  }

  onMostrarColunas() {
    if(this.ocultarColunas) {
      this.displayedColumns = ['statusTransacao','tipoPlano','valorPago','dtPagamentoPlanoContratado','formaPagamento'];
    } else {
      this.displayedColumns = ['statusTransacao','tipoPlano','valorPago','valorCorretor','dtPagamentoPlanoContratado','formaPagamento'];
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['historicoPagamentos'] && this.historicoPagamentos && this.historicoPagamentos.length > 0) {
      this.carregarListaHistoricoPagamento();
    }
  }

  private carregarListaHistoricoPagamento(){
    this.dataSource.data      = this.historicoPagamentos;
    this.dataSource.sort      = this.sort;  
    this.mostrarTabela        = true; 
  }

  ngAfterViewInit() {
    this.dataSource.data      = this.historicoPagamentos || [];
    this.dataSource.sort      = this.sort;
  }

  ngAfterContentChecked(): void {
    this.drc.detectChanges();
  }

  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }

  isAssinaturaVigente(){
    return !!this.assinaturaAtiva;
  }

  isAssivaturaVigenteAndPagamentoCartao(){
    return this.isAssinaturaVigente && this.assinaturaAtiva?.formaPagamento?.id === FormaPagamentoEnum.CARTAO_CREDITO
  }

  cancelarAssinatura(){
    this.chamaCaixaDialogoCancelarAssinatura(this.assinaturaAtiva);
  }

  mudarCartaoAssinaturaVigente(){
    this.showDialogMudarCartaoAssinatura(this.assinaturaAtiva)
  }

  
  showDialogMudarCartaoAssinatura(assinaturaAtiva: Assinaturas) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      assinaturaAtiva: assinaturaAtiva,
      cartoes: this.cartoes,
      perfilAcesso: this.perfilAcesso,
      idTitular : this.titular.id
    };
    dialogConfig.panelClass = 'configuracaoDialogMudarCartaoAssinatura';

    const dialogRef = this.dialog.open(MudarCartaoAssinaturaDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if(confirma) {
        BroadcastEventService.get('ATUALIZAR_HISTORICO_PAGAMENTO').emit(true);
      } else {
        dialogRef.close();
      }
    });
  }


  private chamaCaixaDialogoCancelarAssinatura(assinaturaAtiva: Assinaturas) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: 'Deseja realmente cancelar sua assinatura ?',
      textoConfirma: 'SIM',
      textoCancela: 'NÃO'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        this.assinaturaPlanoRecorrenciaPagarmeService.cancelarAssinatura(assinaturaAtiva.codigoAssinatura)
        .pipe(
          switchMap(() => {
            return this.historicoPagamentoService.getPagamentoByTitular(assinaturaAtiva.idTitular);
          }),
          tap((historicoPagamentos: HistoricoPagamento[]) => {
            this.historicoPagamentos = historicoPagamentos || [];
            if(!_.isEmpty(this.historicoPagamentos)) {
              this.historicoPagamentos = this.historicoPagamentos.map(h => this.historicoPagamentoBuilder.build(h));
            }
          }),
        )
        .subscribe(() => {
            this.toastService.showSucesso('Assinatura cancelada com sucesso.');
            this.assinaturaAtiva = null;
            this.carregarListaHistoricoPagamento();
        })
      } else {
        dialogRef.close();
      }
    });
  }


  getDescricaoCartao(cartaoPagamento: CarteiraCartaoPagamentoAssociado){
    if(!!cartaoPagamento){
      const primeiros6digitos    = cartaoPagamento.primeiros6digitos;
      const ultimos4digitos      = cartaoPagamento.ultimos4digitos;
      return `(${primeiros6digitos} **** ${ultimos4digitos}) - ${this.expira(cartaoPagamento)}`;
    }
  }

  private expira(cartaoPagamento: CarteiraCartaoPagamentoAssociado){
    if(cartaoPagamento.expirado){
      return `Expirado em ${cartaoPagamento.mesValidade}/${cartaoPagamento.anoValidade}`
    }
    return `Expira em ${cartaoPagamento.mesValidade}/${cartaoPagamento.anoValidade}`;
  }

  isCartaoExpirado(cartaoPagamento: CarteiraCartaoPagamentoAssociado){
    return !!cartaoPagamento? cartaoPagamento.expirado: false;
  }
}