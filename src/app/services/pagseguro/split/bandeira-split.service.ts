import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const path = 'api/pagseguro/split/bandeira/';

@Injectable({
  providedIn: 'root'
})
export class BandeiraSplitService {

  constructor(private http: HttpClient) {}

  get(idSessao: string, binCartao: string) {
    return this.http.get(`${path}sessao/${idSessao}/bin/${binCartao}`);
  }

}
