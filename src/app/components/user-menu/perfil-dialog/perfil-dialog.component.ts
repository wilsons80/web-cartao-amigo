import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';
import { Acesso } from 'src/app/core/acesso';
import { GrupoAcesso } from 'src/app/core/grupo-acesso';
import { PerfilAcesso } from 'src/app/core/perfil-acesso';
import { PerfilAcessoUsuario } from 'src/app/core/perfil-acesso-usuario';
import { PessoaFisica } from 'src/app/core/pessoa-fisica';
import { TipoUsuario } from 'src/app/core/tipo-usuario';
import { UsuarioSistema } from 'src/app/core/usuario-sistema';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { FuncoesUteisService } from 'src/app/services/commons/funcoes-uteis.service';
import { GrupoAcessoService } from 'src/app/services/grupo-acesso/grupo-acesso.service';
import { LoadingPopupService } from 'src/app/services/loadingPopup/loading-popup.service';
import { PerfilAcessoUsuarioService } from 'src/app/services/perfil-acesso-usuario/perfil-acesso-usuario.service';
import { PerfilAcessoService } from 'src/app/services/perfil-acesso/perfil-acesso.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UsuarioSistemaService } from 'src/app/services/usuario-sistema/usuario-sistema.service';
import { UsuarioDialogComponent } from '../../usuarios/usuario-dialog/usuario-dialog.component';

@Component({
  selector: 'perfil-dialog',
  templateUrl: './perfil-dialog.component.html',
  styleUrls: ['./perfil-dialog.component.css'],
  
})
export class PerfilDialogComponent implements OnInit {

  @ViewChild('formulario') formulario;

  hide = true;
  isAtualizar = false;

  minDate = new Date();
  usuarioLogado: UsuarioSistema;

  constructor(private dataUtilService: DataUtilService,
              public usuarioSistemaService: UsuarioSistemaService,
              private drc: ChangeDetectorRef,
              private loadingPopupService: LoadingPopupService,
              private toastService: ToastService,
              private funcoesUteisService: FuncoesUteisService,
              private dialogRef: MatDialogRef<UsuarioDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data) {

      this.usuarioLogado = data.usuarioLogado;
  }

  ngOnInit() {
  }

  ngAfterContentChecked(): void {
    this.drc.detectChanges();
  }

  salvar() {
    this.formatar();
    this.atualizar();
    
  }

  formatar() {
    this.usuarioLogado.pessoaFisica.cep = this.funcoesUteisService.getApenasNumeros(this.usuarioLogado?.pessoaFisica?.cep);
    this.usuarioLogado.pessoaFisica.cpf = this.usuarioLogado.pessoaFisica.cpf ? this.funcoesUteisService.getApenasNumeros(this.usuarioLogado.pessoaFisica.cpf.toString()) : null

    this.usuarioLogado.dataUltimoAcesso            = this.usuarioLogado.dataUltimoAcesso    ? new Date(this.usuarioLogado.dataUltimoAcesso) : null;
    this.usuarioLogado.pessoaFisica.dataNascimento = this.usuarioLogado.pessoaFisica.dataNascimento ? new Date(this.usuarioLogado.pessoaFisica.dataNascimento) : null;
    this.usuarioLogado.pessoaFisica.cpf            = this.funcoesUteisService.getApenasNumeros(this.usuarioLogado.pessoaFisica.cpf)
  }


  private atualizar(){
    this.loadingPopupService.mostrarMensagemDialog('Processando, aguarde...');
    this.usuarioSistemaService.alterar(this.usuarioLogado).subscribe(
    (usuarioSistema: UsuarioSistema) => {
      this.usuarioLogado = usuarioSistema;
      this.formatar();
      this.dialogRef.close(true);
      this.toastService.showSucesso('Operação realizada com sucesso.')
    },
    (error) => {
      
    }).add( () => this.loadingPopupService.closeDialog()  );
  }

  cancelar() {
    this.dialogRef.close(false);
  }

  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }

}