import { HistoricoPagamento } from "./historico-pagamento";

export class ImpressaoCartao {
	idCartao: number;
	nomeAssociado: string;
	numeroCartao: string;
	ativo: boolean;
	isTitular: boolean;
	dataImpressao: Date;
	dataGeracao: Date;
	linkUrlQrcode: string;
	statusPagamento: string;
	dataFimValidade: Date;
}