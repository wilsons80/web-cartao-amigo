import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const path = 'api/pagseguro/split/condicoesparcelas/';

@Injectable({
  providedIn: 'root'
})
export class CondicoesParcelamentoSplitService {

  constructor(private http: HttpClient) {}

  get(idSessao: string, amount: number, creditCardBrand: string, maxInstallmentNoInterest: number) {
    return this.http.get(`${path}`, { params: {
      sessionId: `${idSessao}` ,
      amount: `${amount}` ,
      creditCardBrand: `${creditCardBrand}` ,
      maxInstallmentNoInterest: `${maxInstallmentNoInterest}` ,
      }
    });
  }

}
