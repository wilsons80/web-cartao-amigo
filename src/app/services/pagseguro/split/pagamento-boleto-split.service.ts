import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const path = 'api/pagseguro/split/boleto/pagamento/';

export class CheckoutTransparenteBoleto {
	idPlano: number;
	cpfComprador: string;
	codigoCorretor: string;
	senderHash: string;
  voucher:string;
}

@Injectable({
  providedIn: 'root'
})
export class PagamentoBoletoSplitService {

  constructor(private http: HttpClient) {}

  pagar(parans: CheckoutTransparenteBoleto) {
    return this.http.post(`${path}`, parans);
  }

}
