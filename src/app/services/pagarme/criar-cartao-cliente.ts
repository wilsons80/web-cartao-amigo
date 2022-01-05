import { ClientePagarme } from "./cliente-pagarme";
import { EnderecoCobrancaCartaoClientePagarme } from "./endereco-cobranca-cartao-cliente-Pagarme";

export class CriarCartaoCliente {
	id: string;
	number: string;
	first_six_digits: string;
	last_four_digits: string;
	holder_name: string;
	holder_document: string;
	exp_month: number;
	exp_year: number;
	cvv: string;
	brand: string;
	label: string; // "Sua bandeira"
	status: string;

	customer: ClientePagarme;
	billing_address: EnderecoCobrancaCartaoClientePagarme;

	constructor(){}
}