import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioSistema } from 'src/app/core/usuario-sistema';
import { BaseService } from '../base/base.service';
import { Rotas } from 'src/app/core/rotas';

@Injectable({
  providedIn: 'root'
})
export class UsuarioSistemaService extends BaseService<UsuarioSistema> {

  constructor(http: HttpClient) {
    super(http, Rotas.USUARIO);
  }
}
