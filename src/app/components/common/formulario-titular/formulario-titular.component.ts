import { Component, OnInit, ChangeDetectorRef, Input, forwardRef, SimpleChanges } from '@angular/core';
import { Acesso } from 'src/app/core/acesso';
import { PerfilAcesso } from 'src/app/core/perfil-acesso';
import * as _ from 'lodash';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { Associados } from 'src/app/core/associados';
import { TitularService } from 'src/app/services/titular/titular.service';
import { Titular } from 'src/app/core/titular';
import { ControlContainer, NgForm, NgModelGroup } from '@angular/forms';
import { CartaoService } from 'src/app/services/cartao/cartao.service';

@Component({
  selector: 'formulario-titular',
  templateUrl: './formulario-titular.component.html',
  styleUrls: ['./formulario-titular.component.css'], 
  viewProviders:  [
    { provide:  ControlContainer, useExisting:  NgForm },
    { provide: ControlContainer, useExisting: forwardRef(() => NgModelGroup) }
  ] 
})
export class FormularioTitularComponent implements OnInit {

  @Input() titular: Titular;
  @Input() desabilitarCampos = false;

  maskCNPJ = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  maskPhone = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  maskCelular = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  mascaraCpf = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/,];

  hide = true;
  minDate = new Date();
  associado: Associados;
  perfilAcessos: PerfilAcesso[];
  perfilAcesso: Acesso;

  constructor(private dataUtilService: DataUtilService,
              public titularService: TitularService,
              private drc: ChangeDetectorRef,
              private cartaoService: CartaoService) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngAfterContentChecked(): void {
    this.drc.detectChanges();
  }

  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }

}