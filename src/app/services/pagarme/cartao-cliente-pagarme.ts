export class CartaoClientePagarme {
	id: string;
	first_six_digits: string;
	last_four_digits: string;
	brand: string;
	holder_name: string;
    exp_month: number;
    exp_year: number;
    created_at: Date;
	status: string;
}