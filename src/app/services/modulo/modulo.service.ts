import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base/base.service';
import { Modulo } from 'src/app/core/modulo';
import { Rotas } from 'src/app/core/rotas';

const moduloRootPath = 'api/modulo/';

@Injectable({
  providedIn: 'root'
})
export class ModuloService extends BaseService<Modulo> {

  constructor(http: HttpClient) {
    super(http, Rotas.MODULO);
  }

  getAllModuloFilhos() {
    return this.http.get(moduloRootPath + `filhos`);
  }

  getAllModuloAdministrativoFilhos() {
    return this.http.get(moduloRootPath + `administrativo/filhos`);
  }

  getAllModuloComAcesso() {
    return this.http.get(moduloRootPath + `com-acesso`);
  }
}
