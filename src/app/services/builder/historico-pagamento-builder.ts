import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { GrupoAcesso } from 'src/app/core/grupo-acesso';
import { HistoricoPagamento } from 'src/app/core/historico-pagamento';


@Injectable({
  providedIn: 'root'
})
export class HistoricoPagamentoBuilder  {

  constructor() { }

  build(historicoPagamentoTO: HistoricoPagamento) {
    const tela: any = {};
    
    tela.id                              = historicoPagamentoTO.id;
    tela.linkPagamento                   = historicoPagamentoTO.linkPagamento;
    tela.statusTransacao                 = historicoPagamentoTO.statusTransacao.descricao;
    tela.numeroTransacaoGatewayPagamento = historicoPagamentoTO.numeroTransacaoGatewayPagamento;
    tela.tipoPlano                       = historicoPagamentoTO.tipoPlano;
    tela.valorPlano                      = historicoPagamentoTO.tipoPlano.valor;
    tela.dtPagamentoPlanoContratado      = historicoPagamentoTO.dtPagamentoPlanoContratado;
    tela.formaPagamento                  = historicoPagamentoTO.formaPagamento.descricao;
    tela.valorPago                       = historicoPagamentoTO.valorPago || 0;
    tela.valorCorretor                   = historicoPagamentoTO.valorCorretor || 0;
    tela.titular                         = historicoPagamentoTO.titular;
    tela.cartaoPagamento                 = historicoPagamentoTO.cartaoPagamento;
    return tela;
  }

}

