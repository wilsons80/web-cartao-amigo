import { Component, OnInit, ChangeDetectorRef, Input, forwardRef, ViewChild, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { ControlContainer, NgForm, NgModelGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MediaMatcher } from '@angular/cdk/layout';
import { ProcedimentoAssociadoClinicaDto } from 'src/app/core/procedimento-associado-clinica-dto';

@Component({
  selector: 'formulario-consultas-realizadas',
  templateUrl: './formulario-consultas-realizadas.component.html',
  styleUrls: ['./formulario-consultas-realizadas.component.css'], 
  viewProviders:  [
    { provide:  ControlContainer, useExisting:  NgForm },
    { provide: ControlContainer, useExisting: forwardRef(() => NgModelGroup) }
  ] 
})
export class FormularioConsultasRealizadasComponent implements OnInit {

  @Input() procedimentos: ProcedimentoAssociadoClinicaDto[];

  @ViewChild(MatSort) sort: MatSort;

  mostrarTabela = false;

	mobileQuery: MediaQueryList;
	private _mobileQueryListener: () => void;

  displayedColumns: string[] = ['nomeImpresso', 'nomeClinica','especialidade','dataConsulta', 'assinaturaAtiva'];
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

    if (_.isEmpty(this.procedimentos)) {
      this.mostrarTabela = false;
      this.msg = '';
      this.msg = 'Nenhuma consulta realizada.';
    } else {                    
      this.mostrarTabela = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['procedimentos'] && this.procedimentos && this.procedimentos.length > 0) {
      this.dataSource.data      = this.procedimentos;
      this.dataSource.sort      = this.sort;  
      this.mostrarTabela        = true;        
    }
  }

  ngAfterViewInit() {
    this.dataSource.data      = this.procedimentos || [];
    this.dataSource.sort      = this.sort;
  }

  ngAfterContentChecked(): void {
    this.drc.detectChanges();
  }

  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }

}