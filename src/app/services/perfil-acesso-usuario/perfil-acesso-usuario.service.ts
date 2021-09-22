import { CadastroAcesso } from '../../core/cadastro-acesso';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseService } from '../base/base.service';
import { PerfilAcessoService } from '../perfil-acesso/perfil-acesso.service';
import { PerfilAcessoUsuario } from 'src/app/core/perfil-acesso-usuario';
import { Rotas } from 'src/app/core/rotas';


@Injectable({
  providedIn: 'root'
})
export class PerfilAcessoUsuarioService extends BaseService<PerfilAcessoUsuario> {

  constructor(http: HttpClient) {
    super(http, Rotas.PERFIL_ACESSO_USUARIO);
  }
  

  cadastrarAll(gruposAcesso: PerfilAcessoUsuario[]){
    return this.http.post(Rotas.PERFIL_ACESSO_USUARIO + '/gruposacesso' , gruposAcesso);
  }

  alterarAll(gruposAcesso: PerfilAcessoUsuario[]){
    return this.http.put(Rotas.PERFIL_ACESSO_USUARIO + '/gruposacesso' , gruposAcesso);
  }

  buscarGruposAcessoPorUsuario(idUsuario: number){
    return this.http.get(Rotas.PERFIL_ACESSO_USUARIO + '/gruposacesso/usuario/' + idUsuario );
  }


}
