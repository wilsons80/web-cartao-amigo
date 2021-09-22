import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ImpressaoCartao } from 'src/app/core/impressao-cartao';
import { Rotas } from 'src/app/core/rotas';
import { BaseService } from '../base/base.service';
import * as moment from 'moment';


const httpOptions = {
  'responseType'  : 'arraybuffer' as 'json'
};

@Injectable({
  providedIn: 'root'
})
export class ImpressaoCartaoService  extends BaseService<ImpressaoCartao> {

  constructor(http: HttpClient) {
    super(http, Rotas.IMPRESSAO_CARTAO);
  }


  gerarArquivo(listaImpressaoCartao: any) {
    return this.http.post(Rotas.IMPRESSAO_CARTAO + "gerar-impressao-cartao", listaImpressaoCartao, httpOptions);
  }

  gerarCartaBoasVindas(listaImpressaoCartao: any) {
    return this.http.post(Rotas.IMPRESSAO_CARTAO + "gerar-carta-boas-vindas", listaImpressaoCartao, httpOptions);
  }

  getFilter(idpessoafisica: string|number,
            numerocartao: string|number,
            impresso: string|number,
            tipoAssociado: string|number,
            dataInicioGerado: any,
            dataFimGerado: any,
            dataInicioImpresso: any,
            dataFimImpresso: any) {

    idpessoafisica     = idpessoafisica || '';
    numerocartao       = numerocartao || '';

    const p_dataInicioGerado   = dataInicioGerado ? moment(dataInicioGerado).format('YYYY-MM-DD') : '';
    const p_dataFimGerado      = dataFimGerado ? moment(dataFimGerado).format('YYYY-MM-DD') : '';
    const p_dataInicioImpresso = dataInicioImpresso ? moment(dataInicioImpresso).format('YYYY-MM-DD') : '';
    const p_dataFimImpresso    = dataFimImpresso ? moment(dataFimImpresso).format('YYYY-MM-DD') : '';

    return this.http.get(Rotas.IMPRESSAO_CARTAO + 'filter', { params: {
      idpessoafisica: `${idpessoafisica}` ,
      numerocartao: `${numerocartao}`,
      impresso: `${impresso}`,
      tipoAssociado: `${tipoAssociado}`,
      dataInicioGerado: `${p_dataInicioGerado}`,
      dataFimGerado: `${p_dataFimGerado}`,
      dataInicioImpresso: `${p_dataInicioImpresso}`,
      dataFimImpresso: `${p_dataFimImpresso}`

      }
    });
  }


}
