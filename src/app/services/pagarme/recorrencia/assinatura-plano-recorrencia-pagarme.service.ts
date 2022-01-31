import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EditarCartaoAssinaturaPagarme } from '../editar-cartao-assinatura-pagarme';

const path = 'api/pagarme/recorrencia/assinaturas/';

export class NovaAssinaturaPlano {
	plan_id: string;
	customer_id: string;
	card_token: string;
  idCartaoPagarMe: string;

	codigoCorretor: string;
	voucher:string;
  idPlano: number;
  idTitular: number;

	constructor(){}
}

@Injectable({
  providedIn: 'root'
})
export class AssinaturaPlanoRecorrenciaPagarmeService {

  constructor(private http: HttpClient) {}

  criarAssinaturaCartao(parans: NovaAssinaturaPlano) {
    return this.http.post(`${path}criar/cartao`, parans);
  }

  criarAssinaturaBoleto(parans: NovaAssinaturaPlano) {
    return this.http.post(`${path}criar/boleto`, parans);
  }

  editarCartaoAssinatura(idAssinatura: string, parans: EditarCartaoAssinaturaPagarme) {
    return this.http.put(`${path}editar/${idAssinatura}/cartao`, parans);
  }

  cancelarAssinatura(codigoAssinaturaPagarme: string){
	  return this.http.delete(`${path}${codigoAssinaturaPagarme}`);
  }

  listarAssinaturasCliente(idCliente: string){
	  return this.http.get(`${path}cliente/${idCliente}`);
  }

  temAssinaturasVigente(idCliente: string){
	  return this.http.get(`${path}vigente/cliente/${idCliente}`);
  }
}
