import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ParansTokenCartaoPagarme } from '../parans-token-cartao-pagarme';
import { CriarCartaoCliente } from '../criar-cartao-cliente';

const path = 'api/pagarme/recorrencia/clientes/cartoes/';


@Injectable({
  providedIn: 'root'
})
export class CartaoClienteRecorrenciaPagarmeService {

  constructor(private http: HttpClient) {}

  gerarTokenCartao(parans: ParansTokenCartaoPagarme) {
    return this.http.post(`${path}token`, parans);
  }

  excluirCartaoCliente(idCliente: string, idCartao: string){
	  return this.http.delete(`${path}cartao/${idCliente}/${idCartao}`);
  }

  listarCartoesCliente(idCliente: string){
	  return this.http.get(`${path}cartao/${idCliente}`);
  }

  getCartaeCliente(idCliente: string, idCartao: string){
	  return this.http.get(`${path}/cartao/${idCliente}/${idCartao}`);
  }
  
  criarCartao(parans: CriarCartaoCliente) {
    return this.http.post(`${path}`, parans);
  }
}
