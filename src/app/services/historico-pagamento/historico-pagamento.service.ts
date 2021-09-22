import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ImpressaoCartao } from 'src/app/core/impressao-cartao';
import { Rotas } from 'src/app/core/rotas';
import { BaseService } from '../base/base.service';
import * as moment from 'moment';
import { HistoricoPagamento } from 'src/app/core/historico-pagamento';


@Injectable({
  providedIn: 'root'
})
export class HistoricoPagamentoService  extends BaseService<HistoricoPagamento> {

  constructor(http: HttpClient) {
    super(http, Rotas.HISTORICO_PAGAMENTO);
  }


  getPagamentoByTitular(idTitular: number) {
    return this.http.get(`${Rotas.HISTORICO_PAGAMENTO}titular/${idTitular}`);
  }

}
