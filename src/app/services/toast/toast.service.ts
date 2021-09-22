import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorToastComponent } from 'src/app/components/common/http-error-toast/http-error-toast.component';


@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private _snackBar: MatSnackBar) { }

  showAlerta(mensagem: string, id?: number) {
    this.showToast(true, mensagem, 10000, id);
  }

  showSucesso(mensagem: string) {
    this.showToast(false, mensagem, 5000);
  }

  private showToast(isError: boolean, mensagem: string, duracao: number, id?: number) {
    this._snackBar.openFromComponent(HttpErrorToastComponent, {
      duration: duracao,
      horizontalPosition: 'left',
      data: { mensagem, id },
      panelClass: isError ? 'backgroud-error' : ''
    });
  }

}
