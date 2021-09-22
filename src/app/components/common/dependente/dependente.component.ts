import { Component, OnInit, ChangeDetectorRef, Input, forwardRef } from '@angular/core';
import { Acesso } from 'src/app/core/acesso';
import * as _ from 'lodash';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { Associados } from 'src/app/core/associados';
import { TitularService } from 'src/app/services/titular/titular.service';
import { Titular } from 'src/app/core/titular';
import { ControlContainer, NgForm, NgModelGroup } from '@angular/forms';
import { DependentesTitular } from 'src/app/core/dependentes-titular';

@Component({
  selector: 'dependente',
  templateUrl: './dependente.component.html',
  styleUrls: ['./dependente.component.css'], 
  viewProviders:  [
    { provide:  ControlContainer, useExisting:  NgForm },
    { provide: ControlContainer, useExisting: forwardRef(() => NgModelGroup) }
  ] 
})
export class DependenteComponent implements OnInit {

  @Input() dependente: DependentesTitular;
  @Input() desabilitarCampos = false;
  @Input() perfilAcesso: Acesso;

  maskCNPJ = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  maskPhone = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  maskCelular = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  mascaraCpf = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/,];

  hide = true;
  isAtualizar = false;

  pinDependente = Date.now();

  minDate = new Date();
  associado: Associados;
  
  constructor(private dataUtilService: DataUtilService,
              public titularService: TitularService,
              private drc: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  
  ngAfterContentChecked(): void {
    this.drc.detectChanges();
  }

  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }

  isNotEditarCPF(): boolean {
    return (this.dependente && !!this.dependente.id) || this.desabilitarCampos;
  }

  isPermissaoApenasConsulta() {
    return this.perfilAcesso.consulta && !this.perfilAcesso.altera && !this.perfilAcesso.deleta && !this.perfilAcesso.insere;
  }

}