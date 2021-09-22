import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rotas } from 'src/app/core/rotas';
import { TipoEspecialidade } from 'src/app/core/tipo-especialidade';
import { BaseService } from '../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadesService extends BaseService<TipoEspecialidade> {

  constructor(http: HttpClient) {
    super(http, Rotas.TIPO_ESPECIALIDADE);
  }

  getAllEspecialidades(){
    return this.http.get(Rotas.TIPO_ESPECIALIDADE);
  }

}

