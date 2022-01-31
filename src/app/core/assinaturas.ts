import { FormaPagamento } from "./forma-pagamento";

export class Assinaturas {
	id: number;
	codigoAssinatura: string;
	ativo: boolean;
	dataCriacao: Date;
	dataCancelamento: Date;
	idTitular: number;
	idPlano: number;
	formaPagamento: FormaPagamento;
}