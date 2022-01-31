export class CarteiraCartaoPagamentoAssociado{

	id: number;
	idTitular: number;
	idClientePagarMe: string;
	idCartaoPagarMe: string;
	dataCriacao: Date;
	mesValidade: string;
	anoValidade: string;
	bandeira: string;
	primeiros6digitos: string;
	ultimos4digitos: string;
	expirado: boolean;
}