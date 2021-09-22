import { AcessoUnidade } from '../../core/acesso-unidade';
import { Injectable } from '@angular/core';

import * as _ from 'lodash';
import { UsuarioLogado } from 'src/app/core/usuario-logado';

@Injectable({
  providedIn: 'root'
})
export class SessaoService {

  idUsuario: number;
  idPessoaFisica: number;
  username: string;
  nomeUsuario: string;
  email: string;
  logo: any;
  loadingCompleto = true;
  isUsuarioLogado = false;
  usuarioLogado: UsuarioLogado;

  public status: boolean = false;
  
  constructor() { }

  setarPropriedadesUsuarioLogado(usuarioLogado: UsuarioLogado) {
    this.usuarioLogado = usuarioLogado;
    this.username = usuarioLogado.username;
    this.nomeUsuario = usuarioLogado.nomeUsuario;
    this.idPessoaFisica = usuarioLogado.idPessoaFisica;
    this.email = usuarioLogado.email;
    this.idUsuario = usuarioLogado.idUsuario;
    this.isUsuarioLogado = true;
  }

  apagaPropriedadesdoUsuarioLogado() {
    this.username = null;
    this.nomeUsuario = null;
    this.isUsuarioLogado = false;
    this.usuarioLogado = null;
  }

  setLoadingCompleto(isCompleto: boolean) {
    this.loadingCompleto = isCompleto;
  }

  setStatusScript(status: boolean) {
    this.status = status;
  }

  getStatusScript() {
    return this.status;
  }

}
