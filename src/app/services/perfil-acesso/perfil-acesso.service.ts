import { PerfilAcesso } from './../../core/perfil-acesso';
import { Rotas } from './../../core/rotas';
import { BaseService } from './../base/base.service';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PerfilAcessoService extends BaseService<PerfilAcesso> {

  constructor(http: HttpClient) {
    super(http, Rotas.PERFIL_ACESSO);
  }
}
