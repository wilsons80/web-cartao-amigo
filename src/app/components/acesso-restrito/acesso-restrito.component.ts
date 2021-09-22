import { Component, OnInit } from '@angular/core';
import { AppSettings } from 'src/app/app.settings';
import { Settings } from 'src/app/app.settings.model';
@Component({
  selector: 'app-acesso-restrito',
  templateUrl: './acesso-restrito.component.html',
  styleUrls: ['./acesso-restrito.component.css']
})
export class AcessoRestritoComponent implements OnInit {

  public settings: Settings;

  constructor(public appSettings:AppSettings,) { 
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.settings.loadingSpinner = false; 
    }); 
  }

  getLogoSemFundoCartaoAmigo(){
    return '../../../assets/imagens/LOGO_CARTAO_AMIGO-V2.1-SEM-FUNDO.png';
  }

  
}
