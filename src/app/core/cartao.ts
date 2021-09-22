import { PessoaFisica } from "./pessoa-fisica";

export class Cartao{
	id: number;
	numeroCartao: string;
	nomeImpresso: string;
	urlCode: string;	
	urlImagemCartao: string;
	ativo: boolean;
	pessoaFisica: PessoaFisica;
	isTitular: boolean;
	idTitular: number;
	dataImpressao: Date;
	dataCriado: Date;
	isPagamentoRealizado: boolean;
	dataValidadePlano: Date;
}