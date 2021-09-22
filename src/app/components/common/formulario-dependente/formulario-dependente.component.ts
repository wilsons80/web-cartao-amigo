import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef, Input, forwardRef } from '@angular/core';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
import { DependentesTitular } from 'src/app/core/dependentes-titular';
import { PessoaFisica } from 'src/app/core/pessoa-fisica';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Cartao } from 'src/app/core/cartao';

@Component({
  selector: 'formulario-dependente',
  templateUrl: './formulario-dependente.component.html',
  styleUrls: ['./formulario-dependente.component.css'], 
  viewProviders:  [
    { provide:  ControlContainer, useExisting:  NgForm },
    { provide: ControlContainer, useExisting: forwardRef(() => NgModelGroup) }
  ] 
})
export class FormularioDependenteComponent implements OnInit {

  @Input() titular: Titular;
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
  step;  
  associado: Associados;

  
  constructor(private dataUtilService: DataUtilService,
              public titularService: TitularService,
              private drc: ChangeDetectorRef,
              private dialog: MatDialog) {
  }

  ngOnInit() {
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  ngAfterContentChecked(): void {
    this.drc.detectChanges();
  }

  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }

  remover(index: number, dependente: DependentesTitular) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: 'Certeza que deseja excluir ?',
      textoConfirma: 'SIM',
      textoCancela: 'NÃO'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        this.titular.dependentes.splice(index, 1);
        this.setStep(0);
      } else {
        dialogRef.close();
      }
    });
  }



  adicionarDependente() {
    if(_.isEmpty(this.titular.dependentes) ) {
      this.titular.dependentes = [];
    }

    const dependente = new DependentesTitular();
    dependente.id = undefined;
    dependente.pessoaFisica = new PessoaFisica();
    dependente.idTitular = this.titular.id;
    dependente.ativo = true;
    dependente.cartao = new Cartao();
    
    this.titular.dependentes.push(dependente);

    this.setStep(this.titular.dependentes.length - 1);
  }

  isPermissaoApenasConsulta() {
    return this.perfilAcesso.consulta && !this.perfilAcesso.altera && !this.perfilAcesso.deleta && !this.perfilAcesso.insere;
  }

  isPermiteAdicionarDependente() {
    if(_.isEmpty(this.titular.dependentes)) {
      this.titular.dependentes = [];
    }
    return this.titular.dependentes.length <= 4 && !this.isPermissaoApenasConsulta();
  }

}