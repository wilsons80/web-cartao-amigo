import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CodigoAutorizacaoCorretor } from 'src/app/core/codigo-autorizacao-corretor';

const path = 'api/pagseguro/split/corretor/';

@Injectable({
  providedIn: 'root'
})
export class CorretorSplitService {

  constructor(private http: HttpClient) {}

  salvarCodigoAutorizacaoCorretor(dados: CodigoAutorizacaoCorretor) {
    return this.http.post(path, dados);
  }

}
