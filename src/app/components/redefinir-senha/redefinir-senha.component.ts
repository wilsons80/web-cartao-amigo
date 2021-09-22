import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings } from 'src/app/app.settings';
import { Settings } from 'src/app/app.settings.model';
import { AutenticadorService } from 'src/app/services/autenticador/autenticador.service';
import { LoadingPopupService } from 'src/app/services/loadingPopup/loading-popup.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { RedefinirSenhaService } from 'src/app/services/redefinir-senha/redefinir-senha.service';
import { SessaoService } from 'src/app/services/sessao/sessao.service';

@Component({
  selector: 'redefinir-senha',
  templateUrl: './redefinir-senha.component.html',
  styleUrls: ['./redefinir-senha.component.scss']
})
export class RedefinirSenhaComponent implements OnInit {


  error: any;
  hide = true;

  emailEnviado = false;
  email:string;

  public settings: Settings;
  
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    public sessaoService:SessaoService,
    public appSettings: AppSettings,
    private redefinirSenhaService: RedefinirSenhaService,
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
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.settings.loadingSpinner = false; 
    }); 
  }

  ngAfterContentChecked(): void {
    this.drc.detectChanges();
  }


  redefinir(){
    this.emailEnviado = false;

    this.redefinirSenhaService.enviarEmailRefefinirSenha(this.email)
    .subscribe(() => {
      this.emailEnviado = true;
    });
  }

  isNotMobile(): boolean {
    return this.mobileQuery.matches;
  }

  isMobile(): boolean {
    return !this.mobileQuery.matches;
  }

  
  imagemLogin(){
    return '../../../assets/imagens/LOGO_CARTAO_AMIGO-V2.1-SEM-FUNDO.png';
  }
  
  getLogoCartaoAmigo() {
    return '../../../assets/imagens/LOGO_CARTAO_AMIGO-V2.2.jpg';
  }

}
