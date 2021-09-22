import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { LoadingPopupComponent } from './loading-popup.component';
import { finalize, throttleTime } from 'rxjs/operators';
import { Observable, asyncScheduler } from 'rxjs';
import { LoadingIndicatorService } from '../loadingIndicator/loading-indicator.service';

const dialogConfig = new MatDialogConfig();

@Injectable({
  providedIn: 'root'
})
export class LoadingPopupService {

  dialogRef: MatDialogRef<any, any>;

  constructor(public dialog: MatDialog,
    private loadingIndicatorService: LoadingIndicatorService,
  ) {
  }

  mostrarMensagemDialog(texto: string): void {
    if (this.dialogRef !== undefined && this.dialogRef.componentInstance !== null) {
      this.changeMassageDialog(texto);
    } else {
      this.openDialog(texto);
    }
  }

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  /** Abre e fecha o popup ao final da requisição */
  aguardeObservable(observable$): Observable<any> {
    this.mostrarMensagemDialog('Aguarde...');
    return observable$.pipe(finalize(() => this.closeDialog()));
  }

  private openDialog(texto: string): void {
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      mensagem: texto
    };

    this.dialogRef = this.dialog.open(LoadingPopupComponent, dialogConfig);
  }

  private changeMassageDialog(texto: string): void {
    this.dialogRef.componentInstance.mensagem = texto;
  }

  /** Abre e fecha o loading quando não houver mais requisições http */
  mostrarMsgEnquantoHouverRequisicoes(texto: string): void {
    const subs = this.loadingIndicatorService.onLoadingChanged
      .pipe(
        throttleTime(400, asyncScheduler, {
          leading: false,
          trailing: true
        })
      ).subscribe(
        loading => {
          if (!loading) {
            this.closeDialog();
            subs.unsubscribe();
          }
        },
        () => subs.unsubscribe()
      );

    this.mostrarMensagemDialog(texto);
  }

}
