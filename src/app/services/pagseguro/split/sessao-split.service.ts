import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const path = 'api/pagseguro/split/sessao/';

@Injectable({
  providedIn: 'root'
})
export class SessaoSplitService {

  constructor(private http: HttpClient) {}

  get() {
    return this.http.get(`${path}`);
  }

}
