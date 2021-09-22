import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const path = 'api/pagseguro/split/tokencartao/';

export class ParansTokenCartao {
  idSessao: string; 
  valor: number;
  numeroCartao: string; 
  bandeiraCartao: string; 
  cvv: string;
  mesVencimentoCartao: string; 
  anoVencimentoCartao: string;
}

@Injectable({
  providedIn: 'root'
})
export class TokenCartaoSplitService {

  constructor(private http: HttpClient) {}

  get(parans: ParansTokenCartao) {
    return this.http.post(`${path}`, parans);
  }

}
