import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSettings } from 'src/app/app.settings';
import { Settings } from 'src/app/app.settings.model';
import { RedefinirSenhaService } from 'src/app/services/redefinir-senha/redefinir-senha.service';
import { SessaoService } from 'src/app/services/sessao/sessao.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'redefinir-senha',
  templateUrl: './redefinir-nova-senha.component.html',
  styleUrls: ['./redefinir-nova-senha.component.scss']
})
export class RedefinirNovaSenhaComponent implements OnInit {

  error: any;
  hide = true;

  senhaTrocada = false;
  
  senha1:string;
  senha2:string;

  codigoValidacao:string;
  redefinirSenha: any;

  public settings: Settings;
  
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    public sessaoService:SessaoService,
    private router: Router,
    public appSettings: AppSettings,
    private activatedRoute: ActivatedRoute,
    private redefinirSenhaService: RedefinirSenhaService,
    private toastService: ToastService,
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
    this.codigoValidacao = this.activatedRoute.snapshot.queryParams['codigo'];
    if(!this.codigoValidacao) {
      this.toastService.showAlerta('Erro ao recuperar o código de validação.');
      this.router.navigate(['/login']);
      return;
    }

    this.redefinirSenhaService.getRedefinirSenha(this.codigoValidacao)
    .subscribe((redefinirSenha: any) => {
      if(!redefinirSenha) {
        this.toastService.showAlerta('O código de redefinição de senha expirou ou não existe.');
        this.router.navigate(['/login']);
      } else {
        this.redefinirSenha = redefinirSenha;
      }
    });

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
    this.senhaTrocada = false;
    if(this.senha1 !== this.senha2) {
      this.toastService.showAlerta('As senhas informadas não conferem.');
      return;
    }

    this.redefinirSenhaService.redefinirNovaSenha(this.senha1, this.senha2, this.redefinirSenha.id)
    .subscribe(() => {
      this.senhaTrocada = true;
    },
    (error) => {
      this.senhaTrocada = false;
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
