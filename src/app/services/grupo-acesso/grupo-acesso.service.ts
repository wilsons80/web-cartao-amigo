import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GrupoAcesso } from 'src/app/core/grupo-acesso';
import { Rotas } from 'src/app/core/rotas';
import { BaseService } from '../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class GrupoAcessoService extends BaseService<GrupoAcesso> {

  constructor(http: HttpClient) {
    super(http, Rotas.GRUPO_ACESSO);
  }


  getGrupoAcessoAdministrativo() {
    return this.http.get(Rotas.GRUPO_ACESSO + 'administrativo');
  }
  
  
  getFiltro(descricaoGrupoAcesso: string,
            idModulo: string|number ) {

    descricaoGrupoAcesso       = descricaoGrupoAcesso || '';
    idModulo                   = idModulo || '';
    
    return this.http.get(Rotas.GRUPO_ACESSO + 'filter', { params: {
        nome: `${descricaoGrupoAcesso}` ,
        idModulo: `${idModulo}` 
        }
    });
  }

}
