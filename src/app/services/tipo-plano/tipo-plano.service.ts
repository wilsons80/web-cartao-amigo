import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base/base.service';
import { Modulo } from 'src/app/core/modulo';
import { Rotas } from 'src/app/core/rotas';
import { TipoPlano } from 'src/app/core/tipo-plano';

const path = 'api/tipoplanos/';

@Injectable({
  providedIn: 'root'
})
export class TipoPlanoService extends BaseService<TipoPlano> {

  constructor(http: HttpClient) {
    super(http, path);
  }

  getAllAtivos() {
    return this.http.get(path + `ativos`);
  }

}
