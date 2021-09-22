import { Cacheable } from 'ngx-cacheable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const rootPath = 'api/arquivoinstituicao/';

const httpOptions = {
  'responseType'  : 'arraybuffer' as 'json'
};

@Injectable({
  providedIn: 'root'
})
export class ArquivoInstituicaoService {

  constructor(private http: HttpClient) { }

  gravar(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(rootPath, formData);
  }

  gravarComIdInstituicao(file: File, id: number) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${rootPath}/instituicao/${id}`, formData);
  }

  alterar(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.put(rootPath, formData);
  }

  alterarComIdInstituicao(file: File, id: number) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.put(`${rootPath}/instituicao/${id}`, formData);
  }

  get(id: number) {
    return this.http.get(rootPath + `${id}`, httpOptions);
  }
}



