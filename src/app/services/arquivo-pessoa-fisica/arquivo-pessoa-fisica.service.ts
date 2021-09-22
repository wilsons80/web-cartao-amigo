import { Injectable } from '@angular/core';
import { Cacheable } from 'ngx-cacheable';
import { HttpClient } from '@angular/common/http';

const rootPath = 'api/arquivopessoafisica/';

const httpOptions = {
  'responseType'  : 'arraybuffer' as 'json'
   //'responseType'  : 'blob' as 'json'        //This also worked
   //'responseType'  : 'blob' as 'json'        //This also worked
};

@Injectable({
  providedIn: 'root'
})
export class ArquivoPessoaFisicaService {

  constructor(private http: HttpClient) { }

  gravar(file: File, idPessoaFisica: number) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${rootPath}${idPessoaFisica}`, formData);
  }

  alterar(file: any, idPessoaFisica: number) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.put(`${rootPath}${idPessoaFisica}`, formData);
  }

  get(id: number) {
    return this.http.get(rootPath + `${id}`, httpOptions);
  }
}
