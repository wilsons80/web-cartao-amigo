import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ImpressaoCartao } from 'src/app/core/impressao-cartao';
import { Rotas } from 'src/app/core/rotas';
import { BaseService } from '../base/base.service';
import * as moment from 'moment';
import { Associados } from 'src/app/core/associados';


@Injectable({
  providedIn: 'root'
})
export class AssociadosService extends BaseService<Associados> {

  constructor(http: HttpClient) {
    super(http, Rotas.ASSOCIADOS);
  }

  getFilter(idPessoaFisicaTitular: string|number,
            ativo: string|number,
            dataInicioGerado: any,
            dataFimGerado: any) {

    idPessoaFisicaTitular     = idPessoaFisicaTitular || '';
    ativo                     = ativo || '';

    const p_dataInicioGerado   = dataInicioGerado ? moment(dataInicioGerado).format('YYYY-MM-DD') : '';
    const p_dataFimGerado      = dataFimGerado ? moment(dataFimGerado).format('YYYY-MM-DD') : '';

    return this.http.get(Rotas.ASSOCIADOS + 'filter', { params: {
      idPessoaFisicaTitular: `${idPessoaFisicaTitular}`,
      ativo: `${ativo}`,
      dataInicioGerado: `${p_dataInicioGerado}`,
      dataFimGerado: `${p_dataFimGerado}`,
      }
    });
  }


}
