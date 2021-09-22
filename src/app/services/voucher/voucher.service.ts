import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Clinica } from 'src/app/core/clinica';
import { Rotas } from 'src/app/core/rotas';
import { BaseService } from '../base/base.service';
import * as moment from 'moment';
import { Voucher } from 'src/app/core/voucher';
import { VoucherDto } from 'src/app/core/voucher-dto';

const httpOptions = {
  'responseType'  : 'arraybuffer' as 'json'
};

@Injectable({
  providedIn: 'root'
})
export class VoucherService extends BaseService<Voucher> {

  constructor(http: HttpClient) {
    super(http, Rotas.VOUCHER);
  }

  getPorCodigo(codigo: string) {
    return this.http.get(Rotas.VOUCHER + 'codigo/'+ codigo);
  }

  salvarLista(listaVoucher: Voucher[]) {
    return this.http.post(Rotas.VOUCHER + 'lista', listaVoucher);
  }
  
  
  getFilter(codigo: string|number,
            ativo: string|number,
            utilizado: string|number,
            dataInicioGerado: any,
            dataFimGerado: any) {

    codigo                  = codigo || '';
    ativo                   = ativo || '';
    utilizado               = utilizado || '';

    const p_dataInicioGerado   = dataInicioGerado ? moment(dataInicioGerado).format('YYYY-MM-DD') : '';
    const p_dataFimGerado      = dataFimGerado ? moment(dataFimGerado).format('YYYY-MM-DD') : '';

    return this.http.get(Rotas.VOUCHER + 'filter', { params: {
      codigo: `${codigo}`,
      ativo: `${ativo}`,
      utilizado: `${utilizado}`,
      dataInicioGerado: `${p_dataInicioGerado}`,
      dataFimGerado: `${p_dataFimGerado}`,
      }
    });
  }

  excluirEmLote(lista: number[]) {
    return this.http.post(Rotas.VOUCHER + "lote", lista);
  }

  exportar(lista: VoucherDto[]) {
    return this.http.post(Rotas.VOUCHER + "exportar", lista, httpOptions);
  }
}
