import { MediaMatcher } from '@angular/cdk/layout';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { AfterContentChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AppSettings } from 'src/app/app.settings';
import { Settings } from 'src/app/app.settings.model';
import { Titular } from 'src/app/core/titular';
import { LoadingPopupService } from 'src/app/services/loadingPopup/loading-popup.service';
import { ActivatedRoute } from '@angular/router';
import { CorretorSplitService } from 'src/app/services/pagseguro/split/corretor-split.service';


@Component({
  selector: 'formulario-autorizador-corretor',
  templateUrl: './formulario-autorizador-corretor.component.html',
  styleUrls: ['./formulario-autorizador-corretor.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class FormularioAutorizadorCorretorComponent implements OnInit, AfterContentChecked {

  @ViewChild('formulario') formulario;

  titular: Titular = new Titular();
  public settings: Settings;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  corretorCadastrado = false;
  mensagemErro = null;

  constructor(
    public appSettings: AppSettings,
    private activatedRoute: ActivatedRoute,
    private loadingPopupService: LoadingPopupService,
    private corretorSplitService: CorretorSplitService,
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
    const notificationCode = this.activatedRoute.snapshot.queryParams['notificationCode'];
    const publicKey        = this.activatedRoute.snapshot.queryParams['publicKey'];

    const dados = {
      notificationCode: notificationCode,
      publicKey: publicKey
    }

    this.loadingPopupService.mostrarMensagemDialog("Processando...");
    this.corretorSplitService.salvarCodigoAutorizacaoCorretor(dados)
    .subscribe(() =>{
      this.corretorCadastrado = true;
    }, 
    (error) => {
      this.mensagemErro = error.error.mensagem;

    }).add(() => {
      this.loadingPopupService.closeDialog();
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

  isMobile(): boolean {
    return this.mobileQuery.matches;
  }

  isNotMobile(): boolean {
    return !this.mobileQuery.matches;
  }

  getLikeSucesso() {
    return '../../../../assets/imagens/like-sucesso.png';
  }

  getImagemError() {
    return '../../../../assets/imagens/imagem-error.png';
  }

  getLogoCartaoAmigo() {
    return '../../../assets/imagens/LOGO_CARTAO_AMIGO-V2.2.jpg';
  }

}
