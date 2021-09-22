import { CommonModule } from '@angular/common';
import { ErrorHandler, Injectable, NgModule } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from 'src/app/services/toast/toast.service';

@Injectable()
export class ErrorsHandler implements ErrorHandler {
  constructor(
    private toastService: ToastService,
  ) {

  }

  handleError(error: Error | HttpErrorResponse) {
    if (error.name !== 'HttpErrorResponse' ) {

      if(error.message.includes('Token de Acesso inválido') ) {
        this.toastService.showAlerta("Seu acesso expirou, efetue o login novamente.");      
      } else {
        this.toastService.showAlerta("Ocorreu um erro em seu navegador. Por favor tecle Ctrl+F5. Se não resolver, entre em contato com o suporte.");
      }
  
      console.error(error);
    }
  }
}

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorsHandler }],
  declarations: [],
})
export class ExceptionHandlerModule { }
