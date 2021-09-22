import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const path = 'api/validarcartao/'

@Injectable({
  providedIn: 'root'
})
export class ValidarCarteirinhaService {

  constructor(private http: HttpClient) { }

  getValidacaoCarteirinha(idClinica:number, idTipoEspecialidade:number, nrCartao:string) {
    return this.http.get(`${path}${idClinica}/${idTipoEspecialidade}/cartao/${nrCartao}`);
  }
}

