import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PessoaFisica } from 'src/app/core/pessoa-fisica';
import { BaseService } from '../base/base.service';
import { Rotas } from 'src/app/core/rotas';

@Injectable({
  providedIn: 'root'
})
export class PessoaFisicaService extends BaseService<PessoaFisica> {
  constructor(http: HttpClient) {
    super(http, Rotas.PESSOA_FISICA);
  }

  getAllAssociadosByCombo() {
    return this.http.get(`${Rotas.PESSOA_FISICA}associados/combo`);
  }

  getAllColaboradoresFornecedores() {
    return this.http.get(`${Rotas.PESSOA_FISICA}fornecedor_colaborador`);
  }

}
