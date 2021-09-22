import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const autorizacaoPath = 'api/pagseguro/split/autorizacao/';

@Injectable({
  providedIn: 'root'
})
export class AutorizacaoSplitService {

  constructor(private http: HttpClient) {}

  get() {
    return this.http.get(autorizacaoPath);
  }

}
