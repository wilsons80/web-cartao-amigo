import { PessoaFisica } from "./pessoa-fisica";

export class Corretor{
	id: number;
	publicKey: string;
	codigo: string;
	pessoaFisica: PessoaFisica;
	ativo: boolean;
	dtCadastro: Date;
	isPorcentagem: boolean;
	valorRecebimento: number;
	linkPagamento: string;	
	token: string;
}