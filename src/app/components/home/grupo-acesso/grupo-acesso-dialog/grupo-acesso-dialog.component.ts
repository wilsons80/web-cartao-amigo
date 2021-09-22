import { Component, OnInit, Inject } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Acesso } from 'src/app/core/acesso';
import { GrupoAcesso } from 'src/app/core/grupo-acesso';
import { GrupoAcessoModulos } from 'src/app/core/grupo-acesso-modulos';
import { Modulo } from 'src/app/core/modulo';
import { PerfilAcesso } from 'src/app/core/perfil-acesso';
import { GrupoAcessoService } from 'src/app/services/grupo-acesso/grupo-acesso.service';
import { LoadingPopupService } from 'src/app/services/loadingPopup/loading-popup.service';
import { PerfilAcessoService } from 'src/app/services/perfil-acesso/perfil-acesso.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import * as _ from 'lodash';
import { GrupoAcessoBuilder } from 'src/app/services/builder/grupo-acesso-builder';

@Component({
  selector: 'grupo-acesso-dialog',
  templateUrl: './grupo-acesso-dialog.component.html',
  styleUrls: ['./grupo-acesso-dialog.component.css'],
  
})
export class GrupoAcessoDialogComponent implements OnInit {

  grupoAcesso: GrupoAcesso;
  perfilAcessos: PerfilAcesso[];
  modulos: Modulo[];
  perfilAcesso: Acesso;

  constructor(private perfilAcessoService: PerfilAcessoService,
              private grupoAcessoService: GrupoAcessoService,
              private loadingPopupService: LoadingPopupService,
              private toastService: ToastService,
              private grupoAcessoBuilder: GrupoAcessoBuilder,
              private dialogRef: MatDialogRef<GrupoAcessoDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data) {
      this.grupoAcesso = data.grupoAcesso;
      this.modulos = data.modulos;
      this.perfilAcesso = data.perfilAcesso;
  }

  ngOnInit() {
    if(!this.grupoAcesso) {
      this.grupoAcesso = new GrupoAcesso();
    }

    this.perfilAcessoService.getAll().subscribe((perfis : PerfilAcesso[]) => {
      this.perfilAcessos = perfis;

      this.preencherCombo();
    });
  }

  ngAfterContentChecked(): void {
  }
  
  private preencherCombo(){
    if (this.grupoAcesso.perfilAcesso && this.grupoAcesso.perfilAcesso.id && this.perfilAcessos.length) {
      this.grupoAcesso.perfilAcesso = _.find(this.perfilAcessos, { id: this.grupoAcesso.perfilAcesso.id});
    }
  } 

  salvar() {
    if(this.grupoAcesso.id) {
      this.atualizar();
    }else {
      this.cadastrar();
    }
  }

  private cadastrar(){
    this.loadingPopupService.mostrarMensagemDialog('Processando, aguarde...');
    this.grupoAcessoService.cadastrar(this.grupoAcesso).subscribe(
    (grupoAcesso: GrupoAcesso) => {
      this.grupoAcesso = this.grupoAcessoBuilder.build(grupoAcesso);
      this.toastService.showSucesso('Operação realizada com sucesso.');
      this.dialogRef.close(true);
    },
    (error) => {
      
    }).add( () => this.loadingPopupService.closeDialog()  );
  }

  private atualizar(){
    this.loadingPopupService.mostrarMensagemDialog('Processando, aguarde...');
    this.grupoAcessoService.alterar(this.grupoAcesso).subscribe(
    (grupoAcesso: GrupoAcesso) => {
      this.grupoAcesso = this.grupoAcessoBuilder.build(grupoAcesso);
      this.toastService.showSucesso('Operação realizada com sucesso.')
      this.dialogRef.close(true);
    },
    (error) => {
      
    }).add( () => this.loadingPopupService.closeDialog()  );
  }

  cancelar() {
    this.dialogRef.close(false);
  }

  addGrupoAcessoModulo() {
    if (!this.grupoAcesso.gruposAcessoModulos) {
      this.grupoAcesso.gruposAcessoModulos = [];
    }

    const grupo:any = new GrupoAcessoModulos();
    grupo.modulo  = new Modulo();
    
    grupo.id = undefined;
    grupo.idGrupoAcesso = this.grupoAcesso.id;

    this.grupoAcesso.gruposAcessoModulos.push(grupo);
  }

}