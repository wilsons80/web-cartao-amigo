import { Cartao } from "./cartao";
import { DependentesTitular } from "./dependentes-titular";
import { PessoaFisica } from "./pessoa-fisica";

export class Titular {
    id: number;
	pessoaFisica: PessoaFisica;
	ativo: boolean;
	dependentes: DependentesTitular[];
	dtCadastro: Date;
	codigoCorretor: string;
	senha?:string;
	senhaConfirmada?:string;
	cartao: Cartao;
}