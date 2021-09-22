import { PerfilAcessoUsuario } from "./perfil-acesso-usuario";
import { PessoaFisica } from "./pessoa-fisica";
import { TipoUsuario } from "./tipo-usuario";

export class UsuarioSistema {
	id: number;
	username: string;
	senha: string;
	dataUltimoAcesso: Date;
	qtdAcessoNegado: number;
	stAtivo: boolean;
	stTrocaSenha: boolean;
	pessoaFisica: PessoaFisica;
	tipoUsuario: TipoUsuario;

	gruposAcesso: PerfilAcessoUsuario[];
}
