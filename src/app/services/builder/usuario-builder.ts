import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Usuario } from 'src/app/core/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioBuilder  {

  constructor() { }

  build(to: any) {
    const usuarioTela: any = {};

    usuarioTela.login                 = to.login;
    usuarioTela.ativo                 = to.stAtivo;
    
    return usuarioTela;
  }

}

