import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const tokenRootPath = 'api/token/';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private http: HttpClient) { }

  refreshToken(){
    return this.http.get(tokenRootPath + "refresh-token/");
  }
}
