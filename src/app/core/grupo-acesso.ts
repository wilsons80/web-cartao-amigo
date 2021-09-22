import { GrupoAcessoModulos } from "./grupo-acesso-modulos";
import { PerfilAcesso } from "./perfil-acesso";

export class GrupoAcesso {
    id: number;
	nomeGrupoAcesso: string;
	perfilAcesso: PerfilAcesso;
	gruposAcessoModulos: GrupoAcessoModulos[];
    
}