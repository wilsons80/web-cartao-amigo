import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const enderecoRootPath = 'api/endereco/';

@Injectable({
  providedIn: 'root'
})
export class EnderecoService {

  constructor(private http: HttpClient) { }

  getAllEstados() {
    return this.http.get(enderecoRootPath + `estados`);
  }

  getEnderecoPorCep(cep: any): Observable<any> {
    return this.http.get(`${enderecoRootPath}cep/${cep}`);
  }


  getAllBairrosPorUF(uf: string) {
    return this.http.get(`${enderecoRootPath}bairros/${uf}`);
  }
  
}
