import { MediaMatcher } from '@angular/cdk/layout';
import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppSettings } from 'src/app/app.settings';
import { Settings } from 'src/app/app.settings.model';
import { Login } from 'src/app/core/login';
import { LoadingPopupService } from 'src/app/services/loadingPopup/loading-popup.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { SessaoService } from 'src/app/services/sessao/sessao.service';
import { Menu } from './../../core/menu';
import { UsuarioLogado } from './../../core/usuario-logado';
import { AutenticadorService } from './../../services/autenticador/autenticador.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterContentChecked {

  usuario: Login = new Login();
  error: any;
  usuarioLogado: UsuarioLogado;
  hide = true;

  public settings: Settings;
  
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    public sessaoService:SessaoService,
    public appSettings: AppSettings,
    private autenticadorService: AutenticadorService,
    private menuService: MenuService,
    private router: Router,
    private loadingPopupService: LoadingPopupService,
    private drc: ChangeDetectorRef,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
  ) { 
    this.settings = this.appSettings.settings; 

    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);      

  }

  ngOnInit() {
    if (this.autenticadorService.isLoggedIn()) {
      this.router.navigate(['']);
    }
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.settings.loadingSpinner = false; 
    }); 
  }

  ngAfterContentChecked(): void {
    this.drc.detectChanges();
  }

  isMobile(): boolean {
    return !this.mobileQuery.matches;
  }

  isNotMobile(): boolean {
    return this.mobileQuery.matches;
  }

  login() {
    this.loadingPopupService.mostrarMensagemDialog('Preparando ...');
    this.autenticadorService.login(this.usuario).pipe(

      switchMap((usuarioLogado: UsuarioLogado) => {
        this.usuarioLogado = usuarioLogado;
        if (usuarioLogado) {
          return this.menuService.getMenuPrincipal();
        } else
          return new Observable(obs => obs.next())
      }),


    ).subscribe(
    (menu: Menu[]) => {
      this.settings.loadingSpinner = false; 
      this.autenticadorService.usuarioEstaLogado = true;

      if (this.usuarioLogado.trocarSenha ) {
        this.router.navigate(['novasenha']);
      } else {
        if (this.usuarioLogado) {
          this.router.navigate(['']);
        } 
      }
    },
    (error) => this.error = error
    ).add( () => this.loadingPopupService.closeDialog()  )
  }

  imagemBackgroud(){
    return '../../../assets/imagens/LOGO_CARTAO_AMIGO-V1.2.jpg';
  }

  imagemLogin(){
    return '../../../assets/imagens/LOGO_CARTAO_AMIGO-V2.1-SEM-FUNDO.png';
  }
  
  getLogoCartaoAmigo() {
    return '../../../assets/imagens/LOGO_CARTAO_AMIGO-V2.2.jpg';
  }

}
