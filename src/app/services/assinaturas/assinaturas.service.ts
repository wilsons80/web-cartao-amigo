import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base/base.service';
import { Rotas } from 'src/app/core/rotas';
import { Assinaturas } from 'src/app/core/assinaturas';


@Injectable({
  providedIn: 'root'
})
export class AssinaturasService extends BaseService<Assinaturas> {

  constructor(http: HttpClient) {
    super(http, Rotas.ASSINATURAS);
  }

  getAssinaturaAtivaDoTitular(idTitular: number){
    return this.http.get(Rotas.ASSINATURAS + `ativas/titular/${idTitular}`);
  }


}
