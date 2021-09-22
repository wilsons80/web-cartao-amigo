import { Cartao } from "./cartao";
import { PessoaFisica } from "./pessoa-fisica";

export class DependentesTitular {
    id: number;
	pessoaFisica: PessoaFisica;
	idTitular: number;
	ativo: Boolean;
	dtCadastro: Date;
	cartao: Cartao;
}