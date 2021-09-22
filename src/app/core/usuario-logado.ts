import { AcessoModulo } from './acesso-modulo';
import { TipoUsuario } from './tipo-usuario';

export class UsuarioLogado {
    idUsuario: number;
    username: string;
    nomeUsuario: string;
    email: string;
    trocarSenha: boolean;
    token: string;
    idPessoaFisica: number;
    tipoUsuario: TipoUsuario;

    modulos: AcessoModulo[];
}
