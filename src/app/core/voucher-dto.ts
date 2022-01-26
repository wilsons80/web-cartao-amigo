export class VoucherDto{
	idVoucher: number;
	codigo: string;
	descricaoPromocao: string;
	porcentagem: number;
	dataCriacao: Date;
	dataValidade: Date;
	ativo: boolean;
	utilizado: boolean;
	dataUtilizacao: Date;
	nomePessoaUlilizacao: string;
	qtdMesesDesconto: number;

}