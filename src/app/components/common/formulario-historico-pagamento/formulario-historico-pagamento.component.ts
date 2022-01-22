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

  @Input() historicoPagamento: HistoricoPagamento[];
  @Input() ocultarColunas = false;

  @ViewChild(MatSort) sort: MatSort;

  mostrarTabela = false;

	mobileQuery: MediaQueryList;
	private _mobileQueryListener: () => void;

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  msg: string;

  assinaturaPassivelDeCancelamento:HistoricoPagamento;
  
  constructor(private dataUtilService: DataUtilService,
              changeDetectorRef: ChangeDetectorRef,
              private toastService: ToastService,
              private dialog: MatDialog,
              private historicoPagamentoService: HistoricoPagamentoService,
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

    if (_.isEmpty(this.historicoPagamento)) {
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
    if (changes['historicoPagamento'] && this.historicoPagamento && this.historicoPagamento.length > 0) {
      this.carregarListaHistoricoPagamento();
    }
  }

  private carregarListaHistoricoPagamento(){
    this.dataSource.data      = this.historicoPagamento;
    this.dataSource.sort      = this.sort;  
    this.mostrarTabela        = true; 

    if(!_.isEmpty(this.historicoPagamento)){
      this.assinaturaPassivelDeCancelamento = this.historicoPagamento.find(h => h.tipoPlano.ativo && h.tipoPlano.isRecorrencia);
    }
  }

  ngAfterViewInit() {
    this.dataSource.data      = this.historicoPagamento || [];
    this.dataSource.sort      = this.sort;
  }

  ngAfterContentChecked(): void {
    this.drc.detectChanges();
  }

  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }

  isHabilitaBotaoCancelarAssinatura(){
    return !!this.assinaturaPassivelDeCancelamento;
  }

  cancelarAssinatura(){
    this.chamaCaixaDialogoCancelarAssinatura(this.assinaturaPassivelDeCancelamento);
  }

  private chamaCaixaDialogoCancelarAssinatura(historicoPagamento: HistoricoPagamento) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: 'Deseja realmente cancelar sua assinatura ?',
      textoConfirma: 'SIM',
      textoCancela: 'NÃO'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        this.assinaturaPlanoRecorrenciaPagarmeService.cancelarAssinatura(historicoPagamento.numeroTransacaoGatewayPagamento)
        .pipe(
          switchMap(() => {
            return this.historicoPagamentoService.getPagamentoByTitular(historicoPagamento.titular.id);
          }),
          tap((historicoPagamento: HistoricoPagamento[]) => {
            this.historicoPagamento = historicoPagamento;
          })
        )
        .subscribe(() => {
            this.toastService.showSucesso('Assinatura cancelada com sucesso.');
            this.carregarListaHistoricoPagamento();
        })
      } else {
        dialogRef.close();
      }
    });
  }

}