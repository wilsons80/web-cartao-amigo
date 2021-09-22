import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from 'src/app/core/usuario';
import { BaseService } from '../base/base.service';
import { Rotas } from 'src/app/core/rotas';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends BaseService<Usuario> {

  constructor(http: HttpClient) {
    super(http, Rotas.USUARIO);
  }


  getFilter(idUsuario: string|number,
            ativo: string|number,
            dataInicioCadastro: any,
            dataFimCadastro: any
            ) {

      idUsuario               = idUsuario     || '';    
      ativo                   = ativo || '';

      const p_dataInicioCadastro  = dataInicioCadastro  ? moment(dataInicioCadastro ).format('YYYY-MM-DD') : '';
      const p_dataFimCadastro     = dataFimCadastro  ? moment(dataFimCadastro ).format('YYYY-MM-DD') : '';

      return this.http.get(Rotas.USUARIO + 'filter', { params: {
      idUsuario: `${idUsuario}`,
      ativo: `${ativo}`,
      dataInicioCadastro: `${p_dataInicioCadastro}`,
      dataFimCadastro: `${p_dataFimCadastro}`,
    }
    });
  }
}

