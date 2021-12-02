import { Component, ViewChild, HostListener, ChangeDetectorRef } from '@angular/core';
import { LoadingIndicatorService } from 'src/app/services/loadingIndicator/loading-indicator.service';
import { MenuPrincipalService } from './services/menuPrincipal/menu-principal.service';
import { AuthGuard } from './guards/auth.guard';
import { environment } from '../environments/environment';
import { configuracao } from '../environments/configuracao';
import { versions } from 'src/environments/versions';
import { Settings } from './app.settings.model';
import { AppSettings } from './app.settings';
import { MediaMatcher } from '@angular/cdk/layout';
import { SessaoService } from './services/sessao/sessao.service';
import { AutenticadorService } from './services/autenticador/autenticador.service';
import { Router } from '@angular/router';
import { JWTPayload } from './services/autenticador/JWTPayload';
import * as JwtDecode from 'jwt-decode';
import { ScriptService } from './services/carregar-javascript/carregar-javascript.service';
import * as process from 'process';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],  
})
export class AppComponent {
  public settings: Settings;

  versions = versions;
  environment = environment;
  configuracao = configuracao;

  showFiller = false;
  mostrarMenu: any;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;


  constructor(
    public appSettings: AppSettings,
    private scriptService: ScriptService,
    loadingIndicatorService: LoadingIndicatorService,
    public sessaoService: SessaoService,
    private router: Router,
    private drc: ChangeDetectorRef,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,

  ) {
    this.settings = this.appSettings.settings;

    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);      

    if(configuracao.ambiente === 'prod') {
      this.scriptService.load('pagseguro-producao').then(data => console.log('Script producao carregado ')).catch(error => console.log(error));
    } else {
      this.scriptService.load('pagseguro-sandbox').then(data => console.log('Script sandbox carregado ')).catch(error => console.log(error));
    }
    
    loadingIndicatorService.onLoadingChanged.subscribe(
      isLoading => setTimeout(() => this.sessaoService.setLoadingCompleto(!isLoading), 0)
    );
  }

  ngOnInit(): void {
    
  }

  ngAfterContentChecked(): void {
    this.drc.detectChanges();
  }

  isMobile(): boolean {
    return this.mobileQuery.matches;
  }
  
  isNotMobile(): boolean {
    return !this.mobileQuery.matches;
  }

  limparCacheToken() {
    if(localStorage.getItem('expires_at')) {
      localStorage.removeItem('expires_at');
    }

    if(localStorage.getItem('token')) {
      localStorage.removeItem('token');
    }
  }


  ngOnDestroy(): void {
    this.limparCacheToken();
  }


  
}
