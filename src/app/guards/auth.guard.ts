import { EventEmitter, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { AcessoService } from '../services/acesso/acesso.service';
import { AutenticadorService } from '../services/autenticador/autenticador.service';
import { ControleMenuService } from './../services/controle-menu/controle-menu.service';

@Injectable({
  providedIn: 'root'
})
@Injectable()
export class AuthGuard implements CanActivate {

  mostrarMenu = new EventEmitter<boolean>();

  constructor(
    private autenticadorService: AutenticadorService,
    private router: Router,
    private acessoService: AcessoService,
    private controleMenuService: ControleMenuService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {

    if (this.autenticadorService.isLoggedIn()) {

      this.autenticadorService.refreshToken();

      this.mostrarMenu.emit(true);
      return true;
      
    } else {
      this.autenticadorService.logout();
      this.mostrarMenu.emit(false);
      this.router.navigate(['login']);

      return false;
    }
  }

}