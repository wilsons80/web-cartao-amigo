import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Component, Inject } from '@angular/core';


@Component({
  selector: 'app-http-error-toast',
  templateUrl: './http-error-toast.component.html',
  styleUrls: ['./http-error-toast.component.css'],
})
export class HttpErrorToastComponent {

  id: number;
  mensagem: string;

  constructor(
    private snackBarRef: MatSnackBarRef<HttpErrorToastComponent>,
    @Inject(MAT_SNACK_BAR_DATA) data,
  ) {
    this.mensagem = data.mensagem;
    this.id = data.id;
  }

  close() {
    this.snackBarRef.dismiss();
  }

}
