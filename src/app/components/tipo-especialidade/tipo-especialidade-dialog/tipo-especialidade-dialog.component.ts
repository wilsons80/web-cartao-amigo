import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadingPopupService } from 'src/app/services/loadingPopup/loading-popup.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import * as _ from 'lodash';
import { TipoEspecialidade } from 'src/app/core/tipo-especialidade';
import { Acesso } from 'src/app/core/acesso';
import { TipoEspecialidadeService } from 'src/app/services/tipo-especialidade/tipo-especialidade.service';


@Component({
  selector: 'tipo-especialidade-dialog',
  templateUrl: './tipo-especialidade-dialog.component.html',
  styleUrls: ['./tipo-especialidade-dialog.component.css'],
})
export class TipoEspecialidadeDialogComponent implements OnInit {

  tipoEspecialidade: TipoEspecialidade;  
  perfilAcesso: Acesso = new Acesso(); 
  idTipoEspecialidade = null;
  tipoEspecialidades: TipoEspecialidade[];

  constructor(
              private tipoEspecialidadeService: TipoEspecialidadeService,
              private loadingPopupService: LoadingPopupService,
              private toastService: ToastService,
              private dialogRef: MatDialogRef<TipoEspecialidadeDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data) {
      this.idTipoEspecialidade = data.idTipoEspecialidade;
      this.tipoEspecialidades = data.tipoEspecialidades;
      this.perfilAcesso = data.perfilAcesso;
  }

  ngOnInit() {
    this.tipoEspecialidade = new TipoEspecialidade();

    if(!this.idTipoEspecialidade) {
      this.tipoEspecialidade = new TipoEspecialidade();
    } else {
      this.loadingPopupService.mostrarMensagemDialog('Buscando, aguarde...');
      this.tipoEspecialidadeService.getById(this.idTipoEspecialidade)
      .subscribe((tipoEspecialidade: TipoEspecialidade) => {
        this.tipoEspecialidade = tipoEspecialidade;
      }).add( () => this.loadingPopupService.closeDialog()  );
    }
  }

  ngAfterContentChecked(): void {
  }
  
  isPermiteEditar(): boolean {
    return this.perfilAcesso.altera || this.perfilAcesso.insere;
  }
  
  salvar(){
    if(_.isEmpty(this.tipoEspecialidades)) {
      this.tipoEspecialidades = [];
    }

    const especialidade = this.tipoEspecialidades.find(te => te.descricao.toUpperCase() === this.tipoEspecialidade.descricao.toUpperCase());
    if(especialidade) {
      this.toastService.showAlerta('Essa especialidade já está cadastrada.');
      return;
    }


    this.loadingPopupService.mostrarMensagemDialog('Processando, aguarde...');
    this.tipoEspecialidadeService.cadastrar(this.tipoEspecialidade)     
    .subscribe((tipoEspecialidade: TipoEspecialidade) => {
      this.tipoEspecialidade = tipoEspecialidade;
      this.tipoEspecialidades.push(tipoEspecialidade);
      this.tipoEspecialidade = new TipoEspecialidade();
      this.toastService.showSucesso('Operação realizada com sucesso.');
      this.dialogRef.close(true);
    }).add( () => this.loadingPopupService.closeDialog()  );
  }
  

  cancelar() {
    this.dialogRef.close(false);
  }

}