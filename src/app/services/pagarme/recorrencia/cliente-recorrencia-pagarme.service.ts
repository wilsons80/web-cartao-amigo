import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ParansTokenCartaoPagarme } from '../parans-token-cartao-pagarme';
import { CriarCartaoCliente } from '../criar-cartao-cliente';
import { ClientePagarme } from '../cliente-pagarme';

const path = 'api/pagarme/recorrencia/clientes/';


@Injectable({
  providedIn: 'root'
})
export class ClienteRecorrenciaPagarmeService {

  constructor(private http: HttpClient) {}

  
  salvarCliente(parans: ClientePagarme) {
    return this.http.post(`${path}salvar`, parans);
  }

  salvarBaseCliente(parans: ClientePagarme) {
    return this.http.post(`${path}salvar/base`, parans);
  }
}
