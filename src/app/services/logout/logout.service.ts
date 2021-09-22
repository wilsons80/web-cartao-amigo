import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AutenticadorService } from '../autenticador/autenticador.service';
import { MenuPrincipalService } from '../menuPrincipal/menu-principal.service';
import { Router } from '@angular/router';
import { SessaoService } from '../sessao/sessao.service';


const rootPath = 'api/logout';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(
    private http: HttpClient,
    private autenticadorService:AutenticadorService,
    private menuPrincipalService:MenuPrincipalService,
    private router:Router,
    private sessaoService: SessaoService,
    ) { }

  logoutService(){
    return this.http.post(rootPath,{});
  }

  logout(){
    this.autenticadorService.logout();
    
    this.logoutService().subscribe(() => {
      this.menuPrincipalService.logout();
      this.router.navigate(['login']);
      this.sessaoService.apagaPropriedadesdoUsuarioLogado();
    });
  }

}
