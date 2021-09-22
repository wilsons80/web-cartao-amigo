import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GrupoAcesso } from 'src/app/core/grupo-acesso';
import { Rotas } from 'src/app/core/rotas';
import { Titular } from 'src/app/core/titular';
import { BaseService } from '../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class ContaAssociadoService extends BaseService<Titular> {

  constructor(http: HttpClient) {
    super(http, Rotas.CONTA_ASSOCIADO);
  }


  criarConta(titular: Titular) {
    return this.http.post(Rotas.CONTA_ASSOCIADO + 'criar', titular);
  }
  

}
