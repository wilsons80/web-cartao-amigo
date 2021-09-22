import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


const rootPath = 'api/parametros/';


@Injectable({
  providedIn: 'root'
})
export class ParametrosService {

  public timeExpiredToken: number;

  constructor(private http: HttpClient) { }

  getTimeExpiredToken() {
    return this.http.get(rootPath + `expiredToken`);
  }


  carregarTimeExpiredToken() {
    this.getTimeExpiredToken().subscribe((valor: number) => {
      this.timeExpiredToken = valor;
    });
  }
}
