import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rotas } from 'src/app/core/rotas';
import { BaseService } from '../base/base.service';
import { ProcedimentoAssociadoClinicaDto } from 'src/app/core/procedimento-associado-clinica-dto';


@Injectable({
  providedIn: 'root'
})
export class ProcedimentoAssociadoClinicaService extends BaseService<ProcedimentoAssociadoClinicaDto> {

  constructor(http: HttpClient) {
    super(http, Rotas.PROCEDIMENTO_ASSOCIADO_CLINICA);
  }
  
  getAllTitular(idTitular: number) {
    return this.http.get(Rotas.PROCEDIMENTO_ASSOCIADO_CLINICA + 'titular/' + idTitular);
  }

}
