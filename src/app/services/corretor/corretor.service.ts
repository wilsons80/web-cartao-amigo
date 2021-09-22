import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rotas } from 'src/app/core/rotas';
import { BaseService } from '../base/base.service';
import * as moment from 'moment';
import { Corretor } from 'src/app/core/corretor';


@Injectable({
  providedIn: 'root'
})
export class CorretorService extends BaseService<Corretor> {

  constructor(http: HttpClient) {
    super(http, Rotas.CORRETOR);
  }

  getFilter(idCorretor: string|number,
            ativo: string|number,
            dataInicioCadastro: any,
            dataFimCadastro: any) {

    idCorretor     = idCorretor || '';
    ativo          = ativo || '';

    const p_dataInicioCadastro   = dataInicioCadastro ? moment(dataInicioCadastro).format('YYYY-MM-DD') : '';
    const p_dataFimCadastro      = dataFimCadastro ? moment(dataFimCadastro).format('YYYY-MM-DD') : '';

    return this.http.get(Rotas.CORRETOR + 'filter', { params: {
      idCorretor: `${idCorretor}`,
      ativo: `${ativo}`,
      dataInicioGerado: `${p_dataInicioCadastro}`,
      dataFimGerado: `${p_dataFimCadastro}`,
      }
    });
  }


  getByToken(token: string) {
    return this.http.get(Rotas.CORRETOR + 'token/' + token);
  }


}
