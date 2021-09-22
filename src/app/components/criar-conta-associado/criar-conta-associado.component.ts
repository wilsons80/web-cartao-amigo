import { MediaMatcher } from '@angular/cdk/layout';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings } from 'src/app/app.settings';
import { Settings } from 'src/app/app.settings.model';

class DadosCartaoCredito {
   numeroCartao: string;
   nomeImpresso: string;
   mesValidade: string;
   anoValidade: string;
   cvv: string;
}

@Component({
  selector: 'criar-conta-associado',
  templateUrl: './criar-conta-associado.component.html',
  styleUrls: ['./criar-conta-associado.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class CriarContaAssociadoComponent implements OnInit, AfterContentChecked {

  error: any;
  hide = true;

  public settings: Settings;
  
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;


  constructor(
    public appSettings: AppSettings,
    private router: Router,
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

  isMobile(): boolean {
    return this.mobileQuery.matches;
  }

  isNotMobile(): boolean {
    return !this.mobileQuery.matches;
  }

  getLogoCartaoAmigo() {
    return '../../../assets/imagens/LOGO_CARTAO_AMIGO-V2.2.jpg';
  }


}
