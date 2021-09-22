import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Clinica } from 'src/app/core/clinica';
import { Rotas } from 'src/app/core/rotas';
import { BaseService } from '../base/base.service';
import * as moment from 'moment';
import { Cartao } from 'src/app/core/cartao';


@Injectable({
  providedIn: 'root'
})
export class CartaoService extends BaseService<Cartao> {

  constructor(http: HttpClient) {
    super(http, Rotas.CARTAO);
  }

  getCartaoTitularByIdPessoaFisica(idPessoaFisica: number) {
    return this.http.get(Rotas.CARTAO + 'titular/pessoa/' + idPessoaFisica);
  }

  getCartaoDependenteByIdPessoaFisica(idPessoaFisica: number) {
    return this.http.get(Rotas.CARTAO + 'dependente/pessoa/' + idPessoaFisica);
  }

  getAllAtivos(){
    return this.http.get(Rotas.CARTAO + 'ativos');
  }
  
  getAllInativos(){
    return this.http.get(Rotas.CARTAO + 'inativos');
  }

}
