import { GatewayPagamento } from "./gateway-pagamento";

export class StatusTransacaoGatewayPagamento{

	id: number;
	descricao: string;
	gatewayPagamento: GatewayPagamento;
	codigoTransacao: number;
}