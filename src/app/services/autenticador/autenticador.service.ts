import { ToastService } from './../toast/toast.service';
import { MenuPrincipalService } from './../menuPrincipal/menu-principal.service';
import { ArquivoPessoaFisicaService } from './../arquivo-pessoa-fisica/arquivo-pessoa-fisica.service';
import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import * as jwtDecode from 'jwt-decode';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Menu } from 'src/app/core/menu';
import { UsuarioLogado } from 'src/app/core/usuario-logado';
import { ControleMenuService } from 'src/app/services/controle-menu/controle-menu.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { ParametrosService } from '../parametros/parametros.service';
import { TrocaSenha } from './../../core/troca-senha';
import { Usuario } from './../../core/usuario';
import { FileUtils } from './../../utils/file-utils';
import { ArquivoUnidadeService } from './../arquivo/arquivo.service';
import { AcessoUnidade } from 'src/app/core/acesso-unidade';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators'
import * as moment from "node_modules/moment/moment";
import { JWTPayload } from './JWTPayload';
import { SessaoService } from '../sessao/sessao.service';



const autenticadorRootPath = 'api/autenticador/';
const tokenRootPath = 'api/token/';

@Injectable({
  providedIn: 'root'
})
export class AutenticadorService {
  usuarioLogado: UsuarioLogado;
  usuarioEstaLogado = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private sessaoService: SessaoService,
    private arquivoService: ArquivoUnidadeService,
    private fileUtils: FileUtils,
    private menuService: MenuService,
    private controleMenuService: ControleMenuService,
    private menuPrincipalService: MenuPrincipalService
  ) {
    
  }

  private setSession(authResult) {
    const token = authResult.token;
    const payload = <JWTPayload>jwtDecode(token);

    localStorage.setItem('token', authResult.token);
  }

  get token(): string {
    return localStorage.getItem('token');
  }

  login(usuario: Usuario) {
    this.limparDadosSessao();    
  
    return this.http.post(autenticadorRootPath + `login`, usuario).pipe(
      tap((usuarioLogado: UsuarioLogado) => {
        this.usuarioLogado = usuarioLogado;
        this.setSession(usuarioLogado);
        this.sessaoService.setarPropriedadesUsuarioLogado(usuarioLogado);
        this.usuarioEstaLogado = true;
      }
      ),
      shareReplay(),
    );
  }

  limparDadosSessao() {
    localStorage.removeItem('token');
    localStorage.removeItem('logo');
    localStorage.removeItem('fotoPerfil');
    this.usuarioEstaLogado = false;
  }

  logout() {
    this.limparDadosSessao();

    this.http.post('api/logout', {}).pipe(
      finalize(() => {
        this.router.navigateByUrl('/login');
      })
    ).subscribe();
  }

  private refreshTempoSessao() {
    return this.http.get(tokenRootPath + `refresh-token`)
    .pipe(


      /** Dados do Usuario Logado */ 
      switchMap((usuarioLogado: UsuarioLogado) => {
        this.usuarioLogado = usuarioLogado;
        this.setSession(usuarioLogado);
        this.sessaoService.setarPropriedadesUsuarioLogado(usuarioLogado);
        this.usuarioEstaLogado = true;
        return new Observable(obs => obs.next());
      }),

      /** Logo da Empresa */ 
      switchMap(() => {
        return this.getMenu();
      }),

      /** Menu */
      switchMap((menu: Menu[]) => {
        this.controleMenuService.acessos = menu;
        return this.getFotoUsuario();
      }),

      shareReplay(),
      
      catchError((error: any) => {
        if(error.status === 504 || error.error.codigo === 401 || error.error.codigo === 407) {
          this.logout();
        }
        return of(null);
      }),

    ).subscribe((arquivoPFRetorno) => {
      this.setFotoPerfil(arquivoPFRetorno);
    },
    (error) => {
      
    });
  }

  // 10:00:00 => (10:40:00 - 40) and 10:40:00
  refreshToken() {
    return this.refreshTempoSessao();
  }

  isLoggedIn() {
    if(localStorage.getItem('token')) {
      this.usuarioEstaLogado = true;
    }
    
    return this.usuarioEstaLogado;  
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  trocarSenha(trocaSenha: TrocaSenha) {
    return this.http.post(autenticadorRootPath + `trocar-senha`, trocaSenha);
  }

  getLogoEmpresa(unidadeLogada: AcessoUnidade){
    if (unidadeLogada && !localStorage.getItem("logo")) {
      return this.arquivoService.get(unidadeLogada.id)
    } else {
      this.sessaoService.logo = localStorage.getItem("logo");
      return new Observable(obs => obs.next());
    }

  }
  
  getFotoUsuario(){
    //Comentando porque nessa primeira versão não haverá fotos
    /* 
    if (!localStorage.getItem("fotoPerfil")) {
      return this.arquivoPessoaFisicaService.get(this.usuarioLogado.idPessoaFisica)
    } else {
      this.menuPrincipalService.fotoPerfil = localStorage.getItem("fotoPerfil");
      return new Observable(obs => obs.next())
    }
    */
    return new Observable(obs => obs.next());
  }

  setArquivo(arquivoRetorno){
    if (arquivoRetorno) {
      let arquivo: any = this.fileUtils.convertBufferArrayToBase64(arquivoRetorno)
      let urlArquivo = arquivo ? arquivo.changingThisBreaksApplicationSecurity: '';
      localStorage.setItem("logo", urlArquivo);
      this.sessaoService.logo = urlArquivo;
    }
  }

  setFotoPerfil(arquivoPFRetorno){
    if (arquivoPFRetorno) {
      let arquivo: any = this.fileUtils.convertBufferArrayToBase64(arquivoPFRetorno)
      let urlArquivo = arquivo ? arquivo.changingThisBreaksApplicationSecurity: '';
      localStorage.setItem("fotoPerfil", urlArquivo);
      this.menuPrincipalService.fotoPerfil = urlArquivo;
    }
  }

  getMenu(){
    return this.menuService.getMenuPrincipal()
  }
}
