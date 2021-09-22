import { StatusTransacaoGatewayPagamento } from "./status-transacao-gateway-pagamento";

export class NotificacaoTransacao {
	id: number;
	codigoNotificacao: string;
	numeroTransacao: string;
    dtNotificacao: Date;
	status: StatusTransacaoGatewayPagamento;
	quantidadeNotificacao: number;
}