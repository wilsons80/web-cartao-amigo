import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rotas } from 'src/app/core/rotas';
import { BaseService } from '../base/base.service';
import { Autorizacao } from 'src/app/core/autorizacao';


@Injectable({
  providedIn: 'root'
})
export class AutorizacaoService extends BaseService<Autorizacao> {

  constructor(http: HttpClient) {
    super(http, Rotas.AUTORIZACAO_GATEWAY);
  }

  gerarCodigoAutorizacao() {
    return this.http.get(Rotas.AUTORIZACAO_GATEWAY + 'gerar');
  }
}
