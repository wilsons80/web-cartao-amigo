export class Voucher{
	
	id: string;
	codigo: string;
	descricao: string;
	porcentagem: number;
	dataCriacao: Date;
	dataValidade: Date;
	ativo: boolean;
	utilizado: boolean;
	dataUtilizacao: Date;
	idPessoaFisica: number;
	qtdMesesDesconto: number;

}