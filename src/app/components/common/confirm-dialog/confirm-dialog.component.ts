import { Component, OnInit, Inject } from '@angular/core';

import { MatDialogRef} from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';


@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  pergunta: any;
  textoAuxiliar: any;
  textoConfirma: any;
  textoCancela: any;

  isMostrarBotaoCancelar: boolean = true;


  /** é preenchido após a abertura do popup direto na variável: dialogRef.componentInstance.htmlContent = ''
   * Ex: visualizador.service.ts
   */
  htmlContent: string;


  constructor(private dialogRef: MatDialogRef<ConfirmDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data: any) {
    if (data) {
      this.pergunta = _.isArray(data.pergunta) ? data.pergunta : [data.pergunta];
      this.textoAuxiliar = _.isArray(data.textoAuxiliar) ? data.textoAuxiliar : [data.textoAuxiliar];
      this.textoConfirma = data.textoConfirma;
      this.textoCancela = data.textoCancela;

      
      if (data.isMostrarBotaoCancelar === false) {
        this.isMostrarBotaoCancelar = data.isMostrarBotaoCancelar;
      }

      // Não permite fechar o Dialog clicando com 'esc' ou fora do Dialog
      dialogRef.disableClose = data.disableClose;
    }

  }

  ngOnInit() {
    if (!this.textoConfirma) {
      this.textoConfirma = 'Ok';
    }
    if (!this.textoCancela) {
      this.textoCancela = 'Cancelar';
    }
  }

  confirma() {
    this.dialogRef.close(true);
  }

  cancela() {
    this.dialogRef.close(false);
  }

}
