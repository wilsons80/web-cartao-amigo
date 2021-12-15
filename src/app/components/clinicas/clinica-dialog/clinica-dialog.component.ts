import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Clinica } from 'src/app/core/clinica';
import { ClinicaService } from 'src/app/services/clinica/clinica.service';
import { LoadingPopupService } from 'src/app/services/loadingPopup/loading-popup.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import * as _ from 'lodash';
import { ClinicaTipoEspecialidadeService } from 'src/app/services/clinica-tipo-especialidade/clinica-tipo-especialidade.service';
import { switchMap, tap } from 'rxjs/operators';
import { ClinicasTipoEspecialidade } from 'src/app/core/clinicas-tipo-especialidade';
import { TipoEspecialidade } from 'src/app/core/tipo-especialidade';
import { Acesso } from 'src/app/core/acesso';
import { MediaMatcher } from '@angular/cdk/layout';
import { FuncoesUteisService } from 'src/app/services/commons/funcoes-uteis.service';


@Component({
  selector: 'clinica-dialog',
  templateUrl: './clinica-dialog.component.html',
  styleUrls: ['./clinica-dialog.component.css'],
})
export class ClinicaDialogComponent implements OnInit {

  public mascaraCpf = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/,];
  public maskCNPJ = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  public maskPhone = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public maskCelular = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  idClinica: number;
  clinica: Clinica;
  clinicaTipoEspecialidades: ClinicasTipoEspecialidade[];
  tipoEspecialidades: TipoEspecialidade[];
  perfilAcesso: Acesso = new Acesso(); 

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
              private clinicaService: ClinicaService,
              private funcoesUteisService: FuncoesUteisService,
              private clinicaTipoEspecialidadeService: ClinicaTipoEspecialidadeService,
              private loadingPopupService: LoadingPopupService,
              private toastService: ToastService,
              changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              private dialogRef: MatDialogRef<ClinicaDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data) {
      this.idClinica = data.idClinica;
      this.tipoEspecialidades = data.tipoEspecialidades;
      this.perfilAcesso = data.perfilAcesso;

      this.mobileQuery = media.matchMedia('(min-width: 768px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener); 
  }

  ngOnInit() {
    this.clinica = new Clinica();
    this.clinicaTipoEspecialidades = [];
    
    if(this.idClinica) {
      this.loadingPopupService.mostrarMensagemDialog('Buscando, aguarde...');
      this.clinicaService.getById(this.idClinica).pipe(
        tap((clinica: Clinica) => {
          this.clinica = clinica
        }),
        switchMap((clinica: Clinica) => {
          return this.clinicaTipoEspecialidadeService.getAllByClinica(clinica.id);
        })
      ).subscribe((clinicaTipoEspecialidades: ClinicasTipoEspecialidade[]) => {
        this.clinicaTipoEspecialidades = clinicaTipoEspecialidades;
      }).add( () => this.loadingPopupService.closeDialog()  );
    }
  }

  ngAfterContentChecked(): void {
  }


  isPermiteEditar(): boolean {
    return this.perfilAcesso.altera || this.perfilAcesso.insere;
  }

  salvar() {
    this.formatar();
    
    if(this.clinica.id) {
      this.atualizar();
    }else {
      this.cadastrar();
    }
  }

  formatar() {
    this.clinica.cnpj       = this.funcoesUteisService.getApenasNumeros(this.clinica.cnpj);
    this.clinica.cpf        = this.funcoesUteisService.getApenasNumeros(this.clinica.cpf);
    this.clinica.cep        = this.funcoesUteisService.getApenasNumeros(this.clinica.cep);
    this.clinica.telefone01 = this.clinica.telefone01 ? this.funcoesUteisService.getApenasNumeros(this.clinica.telefone01) : '';
    this.clinica.telefone02 = this.clinica.telefone02 ? this.funcoesUteisService.getApenasNumeros(this.clinica.telefone02) : '';
    this.clinica.celular    = this.clinica.celular    ? this.funcoesUteisService.getApenasNumeros(this.clinica.celular) : '';
  }

  private cadastrar(){
    this.loadingPopupService.mostrarMensagemDialog('Processando, aguarde...');
    this.clinicaService.cadastrar(this.clinica).pipe(
      tap((clinica: Clinica) => this.clinica = clinica),
      switchMap((clinica: Clinica) => {
        return this.clinicaTipoEspecialidadeService.salvarEspecialidadesPorClinica(this.clinica.id, this.clinicaTipoEspecialidades);
      })
    ).subscribe((clinicaTipoEspecialidades: ClinicasTipoEspecialidade[]) => {
      this.clinicaTipoEspecialidades = clinicaTipoEspecialidades;
      this.dialogRef.close(true);
      this.toastService.showSucesso('Operação realizada com sucesso.');
    }).add( () => this.loadingPopupService.closeDialog()  );

  }

  private atualizar(){
    this.loadingPopupService.mostrarMensagemDialog('Processando, aguarde...');
    this.clinicaService.alterar(this.clinica).pipe(
      tap((clinica: Clinica) => this.clinica = clinica),
      switchMap((clinica: Clinica) => {
        return this.clinicaTipoEspecialidadeService.salvarEspecialidadesPorClinica(this.clinica.id, this.clinicaTipoEspecialidades);
      })
    ).subscribe((clinicaTipoEspecialidades: ClinicasTipoEspecialidade[]) => {
      this.clinicaTipoEspecialidades = clinicaTipoEspecialidades;
      this.dialogRef.close(true);
      this.toastService.showSucesso('Operação realizada com sucesso.');
    }).add( () => this.loadingPopupService.closeDialog()  );
  }

  cancelar() {
    this.dialogRef.close(false);
  }

  addEspecialidade() {
    if (!this.clinicaTipoEspecialidades) {
      this.clinicaTipoEspecialidades = [];
    }

    const especialidade:ClinicasTipoEspecialidade = new ClinicasTipoEspecialidade();
    especialidade.clinica  = this.clinica;
    especialidade.tipoEspecialidade = new TipoEspecialidade();
    especialidade.valorParticular = 0;
    especialidade.valorAssociado = 0;
    especialidade.ativo = true;    
    especialidade.id = undefined;

    this.clinicaTipoEspecialidades.push(especialidade);
  }

  isMobile(): boolean {
    return !this.mobileQuery.matches;
  }

}