import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef, Input, forwardRef, SimpleChanges } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Acesso } from 'src/app/core/acesso';
import { PerfilAcesso } from 'src/app/core/perfil-acesso';
import { GrupoAcessoService } from 'src/app/services/grupo-acesso/grupo-acesso.service';
import { LoadingPopupService } from 'src/app/services/loadingPopup/loading-popup.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import * as _ from 'lodash';
import { FuncoesUteisService } from 'src/app/services/commons/funcoes-uteis.service';
import { PerfilAcessoUsuarioService } from 'src/app/services/perfil-acesso-usuario/perfil-acesso-usuario.service';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { Associados } from 'src/app/core/associados';
import { TitularService } from 'src/app/services/titular/titular.service';
import { Titular } from 'src/app/core/titular';
import { DependenteTitularService } from 'src/app/services/dependente-titular/dependente-titular.service';
import { ControlContainer, NgForm, NgModelGroup } from '@angular/forms';
import { CartaoService } from 'src/app/services/cartao/cartao.service';
import { Cartao } from 'src/app/core/cartao';
import { BroadcastEventService } from 'src/app/services/broadcast-event/broadcast-event.service';

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
  isAtualizar = false;

  minDate = new Date();
  
  cartao: Cartao;
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
    this.isAtualizar = false;

    if (changes['titular'] && this.titular && this.titular.id && !this.cartao) {
      this.onCarregarDadosCartao();
      this.isAtualizar = true;
    }
  }

  onCarregarDadosCartao() {
    this.cartaoService.getCartaoTitularByIdPessoaFisica(this.titular.pessoaFisica.id)
    .subscribe((cartao: Cartao) => {
      this.cartao = cartao;
    })
  }

  ngAfterContentChecked(): void {
    this.drc.detectChanges();
  }

  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }

}