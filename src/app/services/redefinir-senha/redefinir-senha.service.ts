import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const path = 'api/redefinirsenha/'

@Injectable({
  providedIn: 'root'
})
export class RedefinirSenhaService {

  constructor(private http: HttpClient) { }

  getRedefinirSenha(codigo: String) {
    return this.http.get(`${path}codigovalidacao/${codigo}`);
  }

  redefinirNovaSenha(senha1: string, senha2: string, idRedefinirSenha: number) {
    const redefinirSenha = {
      senha1: senha1,
      senha2: senha2,
      idRedefinirSenha: idRedefinirSenha
    }
    return this.http.post(`${path}trocar/`, redefinirSenha);
  }

  enviarEmailRefefinirSenha(email: string) {
    const solicitarRedefinirSenha = {
      email: email
    }
    return this.http.post(`${path}email/`, solicitarRedefinirSenha);
  }
}

