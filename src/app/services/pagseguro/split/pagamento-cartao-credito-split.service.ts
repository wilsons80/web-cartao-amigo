import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const path = 'api/pagseguro/split/cr/pagamento/';

export class CheckoutTransparenteCartaoCredito {
	idPlano: number;
	cpfComprador: string;
	codigoCorretor: string;
	senderHash: string;
	tokenCartaoCredito: string;
  voucher:string;
  idSessao: string;
	bandeiraCartao: string;
	nomeImpressoCartao: string;
	cpfTitularCartao: string;
	dataNascimentoTitularCartao: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PagamentoCartaoCreditoSplitService {

  constructor(private http: HttpClient) {}

  pagar(parans: CheckoutTransparenteCartaoCredito) {
    return this.http.post(`${path}`, parans);
  }

}
