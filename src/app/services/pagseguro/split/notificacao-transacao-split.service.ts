import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const path = 'api/pagseguro/split/notificacao/';

@Injectable({
  providedIn: 'root'
})
export class NotificacaoTransacalSplitService {

  constructor(private http: HttpClient) {}

  buscarDadosNotificacao(numeroTransacao: string) {
    return this.http.get(path + numeroTransacao);
  }

}
