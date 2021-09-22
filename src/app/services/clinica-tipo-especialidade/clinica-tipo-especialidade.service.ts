import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { ClinicasTipoEspecialidade } from 'src/app/core/clinicas-tipo-especialidade';
import { Rotas } from 'src/app/core/rotas';
import { BaseService } from '../base/base.service';

const path = 'api/clinicastipoespecialidade/';

@Injectable({
  providedIn: 'root'
})
export class ClinicaTipoEspecialidadeService extends BaseService<ClinicasTipoEspecialidade> {

  constructor(http: HttpClient) {
    super(http, Rotas.CLINICA_TIPO_ESPECIALIDADE);
  }

  getAllByClinica(idClinica:number){
    return this.http.get(`${path}clinica/${idClinica}`);
  }

  salvarEspecialidadesPorClinica(idClinica, especialidades: ClinicasTipoEspecialidade[]) {
    especialidades = especialidades || [];
    return this.http.post(`${path}clinica/${idClinica}`, especialidades);
  }

  getFilter(idTipoEspecialidade: string|number,
            uf: string,
            cidade: string,
            ) {

    idTipoEspecialidade     = idTipoEspecialidade || '';    
    uf                      = uf         || '';
    cidade                  = cidade     || '';
   

    return this.http.get(Rotas.CLINICA_TIPO_ESPECIALIDADE + 'filter', { params: {
      idTipoEspecialidade: `${idTipoEspecialidade}`,      
      uf: `${uf}`,
      cidade: `${cidade}`
      }
    });
  }
}
