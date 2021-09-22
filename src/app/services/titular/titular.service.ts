import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base/base.service';
import { Rotas } from 'src/app/core/rotas';
import { Titular } from 'src/app/core/titular';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TitularService extends BaseService<Titular> {

  constructor(http: HttpClient) {
    super(http, Rotas.TITULAR);
  }

  getByIdUsuario(idUsuario) {
    return this.http.get(`${Rotas.TITULAR}usuario/${idUsuario}`);
  }

  excluirSemPagamento(idTitular) {
    return this.http.delete(`${Rotas.TITULAR}sempagamentos/titular//${idTitular}`);
  }
  
}
