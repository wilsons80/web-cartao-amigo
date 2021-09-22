import * as _ from 'lodash';
import { Acesso } from './acesso';

export class CarregarPerfil {
   carregar(perfisAcesso: Acesso[], perfilAcesso: Acesso) {
    _.forEach(perfisAcesso, (acesso) => {
      perfilAcesso.idModulo   = acesso.idModulo;
      perfilAcesso.nomeModulo = acesso.nomeModulo;
      perfilAcesso.altera     = perfilAcesso.altera || acesso.altera;
      perfilAcesso.consulta   = perfilAcesso.consulta || acesso.consulta;
      perfilAcesso.deleta     = perfilAcesso.deleta || acesso.deleta;
      perfilAcesso.insere     = perfilAcesso.insere || acesso.insere;
    });
   }
}
