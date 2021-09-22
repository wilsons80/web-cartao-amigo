import { Injectable } from '@angular/core';
import * as _ from 'lodash';


@Injectable({
  providedIn: 'root'
})
export class UsuarioSistemaBuilder  {

  constructor() { }

  build(to: any) {
    const usuarioTela: any = {};

    usuarioTela.id                    = to.id;
    usuarioTela.login                 = to.username;
    usuarioTela.nome                  = to.pessoaFisica.nome;
    usuarioTela.cpf                   = to.pessoaFisica.cpf;
    usuarioTela.ativo                 = to.stAtivo;
    usuarioTela.descTipoUsuario       = to.tipoUsuario?.descricao?.replace('_', ' ');
    usuarioTela.gruposAcesso          = to.gruposAcesso;

    
    return usuarioTela;
  }

}

