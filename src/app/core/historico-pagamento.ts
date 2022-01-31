import { ArquivoMetadados } from './arquivo-metadado';
import { CarteiraCartaoPagamentoAssociado } from './carteira-cartao-pagamento-associado';
import { FormaPagamento } from './forma-pagamento';
import { GatewayPagamento } from './gateway-pagamento';
import { PessoaFisica } from './pessoa-fisica';
import { StatusTransacaoGatewayPagamento } from './status-transacao-gateway-pagamento';
import { TipoPlano } from './tipo-plano';
import { Titular } from './titular';

export class HistoricoPagamento{

	id: number;
	titular: Titular;
	corretor: PessoaFisica;
	dtPagamentoPlanoContratado: Date;
	gatewayPagamento: GatewayPagamento;
	formaPagamento: FormaPagamento;
	tipoPlano: TipoPlano;
	qtdParcelas: number;
	numeroTransacaoGatewayPagamento: string;
	statusTransacao: StatusTransacaoGatewayPagamento;
	tipoMetodoPagamento: string;
	linkPagamento: string;
	publicKeyPrimaryReceiver: string;
	valorPago: number;
	valorCorretor: number;
	cartaoPagamento: CarteiraCartaoPagamentoAssociado;
}