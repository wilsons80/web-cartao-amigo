import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClinicasTipoEspecialidade } from 'src/app/core/clinicas-tipo-especialidade';
import { Rotas } from 'src/app/core/rotas';
import { TipoEspecialidade } from 'src/app/core/tipo-especialidade';
import { BaseService } from '../base/base.service';


@Injectable({
  providedIn: 'root'
})
export class TipoEspecialidadeService extends BaseService<TipoEspecialidade> {

  constructor(http: HttpClient) {
    super(http, Rotas.TIPO_ESPECIALIDADE);
  }


}
