import { GrupoAcesso } from "./grupo-acesso";
import { UsuarioSistema } from "./usuario-sistema";

export class PerfilAcessoUsuario{
	id: number;
	usuario: UsuarioSistema;
	grupoAcesso: GrupoAcesso;
}
