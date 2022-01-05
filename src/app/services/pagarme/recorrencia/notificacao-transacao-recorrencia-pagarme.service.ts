import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const path = 'api/pagarme/notificacao/';

@Injectable({
  providedIn: 'root'
})
export class NotificacaoTransacaoRecorrenciaPagarmeService {

  constructor(private http: HttpClient) {}

  buscarDadosNotificacao(numeroTransacao: string) {
    return this.http.get(path + numeroTransacao);
  }

}
