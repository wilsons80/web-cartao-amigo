import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AppSettings } from 'src/app/app.settings';
import { Settings } from 'src/app/app.settings.model';
import { SessaoService } from 'src/app/services/sessao/sessao.service';
import { ClinicaService } from 'src/app/services/clinica/clinica.service';
import { ValidarCarteirinhaService } from 'src/app/services/validar-carteirinha/validar-carteirinha.service';
import { ValidarCarteirinha } from 'src/app/core/validar-carteirinha';
import { Clinica } from 'src/app/core/clinica';
import { ClinicaTipoEspecialidadeService } from 'src/app/services/clinica-tipo-especialidade/clinica-tipo-especialidade.service';
import { ClinicasTipoEspecialidade } from 'src/app/core/clinicas-tipo-especialidade';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/services/toast/toast.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogValidarCartaoComponent } from './dialog-validar-cartao/dialog-validar-cartao.component';


@Component({
  selector: 'validar-cartao',
  templateUrl: './validar-cartao.component.html',
  styleUrls: ['./validar-cartao.component.scss']
})
export class ValidarCartaoComponent implements OnInit {
  
  error: any;
  hide = true;
  clinicas: Clinica[];
  clinicasTipoEspecialidades: ClinicasTipoEspecialidade[];
  validarCarteirinha: ValidarCarteirinha;

  clinicaSelecionada:Clinica;
  clinicasTipoEspecialidadeSelecionada:ClinicasTipoEspecialidade;

  numerocartao: string;

  public settings: Settings;
  
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    public sessaoService:SessaoService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    public appSettings: AppSettings,
    private clinicaService: ClinicaService,
    private toastService: ToastService,
    private clinicaTipoEspecialidadeService: ClinicaTipoEspecialidadeService,
    private validarCarteirinhaService: ValidarCarteirinhaService,
    private drc: ChangeDetectorRef,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
  ) { 
    this.settings = this.appSettings.settings; 

    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);     
  }

  ngOnInit(): void {
    this.numerocartao = this.activatedRoute.snapshot.queryParams['numerocartao'] || this.activatedRoute.snapshot.queryParams['NUMEROCARTAO'];
    this.buscarTodasClinicas();
  }
  
  buscarTodasClinicas(){
    this.clinicaService.getAllClinicaAtivas().subscribe((clinicas: Clinica[]) => { 
      this.clinicas = clinicas;
    });
  }


  private buscarTodasAsEspecialidadesClinica(){
    this.clinicasTipoEspecialidades = [];

    if(this.clinicaSelecionada && this.clinicaSelecionada.id) {
      this.clinicaTipoEspecialidadeService.getAllByClinica(this.clinicaSelecionada.id)
      .subscribe((clinicasTipoEspecialidades: ClinicasTipoEspecialidade[]) => { 
        this.clinicasTipoEspecialidades = clinicasTipoEspecialidades;

        if(!_.isEmpty(this.clinicasTipoEspecialidades)) {
          this.clinicasTipoEspecialidades.forEach(c => c.descricaoEspecialidade = c.tipoEspecialidade.descricao);
        }
      });
    }
  }


  getValidacaoCarteirinha(){
    if(!this.clinicaSelecionada || !this.clinicaSelecionada.id) {
      this.toastService.showAlerta('Informa a clínica.');
      return;
    }

    if(!this.clinicasTipoEspecialidadeSelecionada || !this.clinicasTipoEspecialidadeSelecionada.id) {
      this.toastService.showAlerta('Informa a especialidade.');
      return;
    }

    if(!this.numerocartao) {
      this.toastService.showAlerta('Não foi possível recuperar o número do cartão.');
      return;
    }


    this.validarCarteirinhaService.getValidacaoCarteirinha(this.clinicaSelecionada.id, 
                                                           this.clinicasTipoEspecialidadeSelecionada.tipoEspecialidade.id, 
                                                           this.numerocartao)
    .subscribe((validarCarteirinha: ValidarCarteirinha ) =>{
      this.validarCarteirinha = validarCarteirinha;


      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        dadosCartao: this.validarCarteirinha
      };
      dialogConfig.panelClass = 'configuracaoDialogValidarCartao';

      const dialogRef = this.dialog.open(DialogValidarCartaoComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(confirma => {
        if (confirma) {
          // fazer qualquer coisa
        } else {
          dialogRef.close();
        }
      });
    
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

  
  imagemLogin(){
    return '../../../assets/imagens/LOGO_CARTAO_AMIGO-V2.1-SEM-FUNDO.png';
  }
  
  getLogoCartaoAmigo() {
    return '../../../assets/imagens/LOGO_CARTAO_AMIGO-V2.2.jpg';
  }


  onChangeClinica(clinica) {
    console.log(clinica);
    this.buscarTodasAsEspecialidadesClinica();
  }
}
