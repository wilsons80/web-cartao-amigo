import { EnderecoClientePagarme } from "./endereco-cliente-pagarme";
import { TelefoneClientePagarme } from "./telefone-cliente-pagarme";

export class ClientePagarme {
	id: string;
	name: string;
	email: string;
	code: string;
	document: string;
	document_type: string;
	type: string;
	gender: string;
	delinquent: boolean;
	created_at: Date;
	updated_at: Date;
	birthdate: Date;

	address: EnderecoClientePagarme;
	phones: TelefoneClientePagarme;
}