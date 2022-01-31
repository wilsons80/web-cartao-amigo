import { BandeiraCartaoClientePagarme } from "./bandeira-cartao-cliente-pagarme";
import { EnderecoCobrancaCartaoClientePagarme } from "./endereco-cobranca-cartao-cliente-Pagarme";

export class CartaoClientePagarme {
	id: string;
	first_six_digits: string;
	last_four_digits: string;
	brand: string;
	holder_name: string;
	holder_document: string;
    exp_month: number;
    exp_year: number;
    created_at: Date;
	status: string;
	expirado: boolean;

	billing_address: EnderecoCobrancaCartaoClientePagarme;
	bandeiraCartaoTO: BandeiraCartaoClientePagarme;
}