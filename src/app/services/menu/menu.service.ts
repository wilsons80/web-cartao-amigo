import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const rootPath = 'api/menu'

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) { }

  getMenuPrincipal() {
    return this.http.get(rootPath);
  }
}

