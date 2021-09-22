import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const path = 'api/pagseguro/split/meiospagamento/';

@Injectable({
  providedIn: 'root'
})
export class MeiosPagamentoSplitService {

  constructor(private http: HttpClient) {}

  get(idSessao: string, valor: number) {
    return this.http.get(`${path}sessao/${idSessao}/valor/${valor}`);
  }

}
