import { Component, OnInit, ChangeDetectorRef, Input, forwardRef, ViewChild, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { ControlContainer, NgForm, NgModelGroup } from '@angular/forms';
import { HistoricoPagamento } from 'src/app/core/historico-pagamento';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MediaMatcher } from '@angular/cdk/layout';

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
  
  constructor(private dataUtilService: DataUtilService,
              changeDetectorRef: ChangeDetectorRef,
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
      this.dataSource.data      = this.historicoPagamento;
      this.dataSource.sort      = this.sort;  
      this.mostrarTabela = true;        
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

}