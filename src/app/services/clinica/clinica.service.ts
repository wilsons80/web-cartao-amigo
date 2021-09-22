import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Clinica } from 'src/app/core/clinica';
import { Rotas } from 'src/app/core/rotas';
import { BaseService } from '../base/base.service';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class ClinicaService extends BaseService<Clinica> {

  constructor(http: HttpClient) {
    super(http, Rotas.CLINICAS);
  }

  getAllClinicaAtivas(){
    return this.http.get(Rotas.CLINICAS + 'ativas');
  }
  
  getAllClinicaInativas(){
    return this.http.get(Rotas.CLINICAS + 'inativas');
  }

  
  getFilter(idClinica: string|number,
            idTipoEspecialidade: string|number,
            bairro: string|number,
            ativo: string|number,
            dataInicioGerado: any,
            dataFimGerado: any) {

    idClinica               = idClinica || '';
    idTipoEspecialidade     = idTipoEspecialidade || '';
    ativo                   = ativo || '';
    bairro                  = bairro || '';

    const p_dataInicioGerado   = dataInicioGerado ? moment(dataInicioGerado).format('YYYY-MM-DD') : '';
    const p_dataFimGerado      = dataFimGerado ? moment(dataFimGerado).format('YYYY-MM-DD') : '';

    return this.http.get(Rotas.CLINICAS + 'filter', { params: {
      idClinica: `${idClinica}`,
      idTipoEspecialidade: `${idTipoEspecialidade}`,
      bairro: `${bairro}`,
      ativo: `${ativo}`,
      dataInicioGerado: `${p_dataInicioGerado}`,
      dataFimGerado: `${p_dataFimGerado}`,
      }
    });
  }
}
