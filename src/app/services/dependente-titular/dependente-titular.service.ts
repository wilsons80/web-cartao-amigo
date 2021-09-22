import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base/base.service';
import { Rotas } from 'src/app/core/rotas';
import { DependentesTitular } from 'src/app/core/dependentes-titular';


@Injectable({
  providedIn: 'root'
})
export class DependenteTitularService extends BaseService<DependentesTitular> {

  constructor(http: HttpClient) {
    super(http, Rotas.DEPENDENTE_TITULAR);
  }

  isJaDependente(cpf) {
    return this.http.get(`${Rotas.DEPENDENTE_TITULAR}isdependente/${cpf}`);
  }

  getAllByIdTitular(idTitular: number) {
    return this.http.get(`${Rotas.DEPENDENTE_TITULAR}titular/${idTitular}`)
  }
  
}
