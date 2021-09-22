import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { GrupoAcesso } from 'src/app/core/grupo-acesso';


@Injectable({
  providedIn: 'root'
})
export class GrupoAcessoBuilder  {

  constructor() { }

  build(grupoAcessoTO: GrupoAcesso) {
    const grupoAcessoTela: any = {};

    grupoAcessoTela.id                    = grupoAcessoTO.id;
    grupoAcessoTela.nomeGrupoAcesso       = grupoAcessoTO.nomeGrupoAcesso;
    grupoAcessoTela.descricaoPerfilAcesso = grupoAcessoTO.perfilAcesso.descricaoPerfilAcesso;
    grupoAcessoTela.perfilAcesso          = grupoAcessoTO.perfilAcesso;
    grupoAcessoTela.gruposAcessoModulos   = grupoAcessoTO.gruposAcessoModulos.filter(gam => !gam.modulo.agrupador);

    return grupoAcessoTela;
  }

}

