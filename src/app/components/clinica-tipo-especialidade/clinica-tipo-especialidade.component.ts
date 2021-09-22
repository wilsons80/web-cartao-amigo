import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { AppSettings } from 'src/app/app.settings';
import { Settings } from 'src/app/app.settings.model';
import { Acesso } from 'src/app/core/acesso';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';
import { CidadeDto } from 'src/app/core/cidade-dto';
import { Clinica } from 'src/app/core/clinica';
import { ClinicaCombo } from 'src/app/core/clinica-combo';
import { ClinicaDto } from 'src/app/core/clinica-dto';
import { ClinicaTipoEspecialidadeDto } from 'src/app/core/clinica-tipo-especialidade-dto';
import { TipoEspecialidade } from 'src/app/core/tipo-especialidade';
import { TipoEspecialidadeCombo } from 'src/app/core/tipo-especialidade-combo';
import { SharedPipesModule } from 'src/app/pipes/shared-pipes.module';
import { TelefonePipe } from 'src/app/pipes/telefone-pipe';
import { ClinicaTipoEspecialidadeService } from 'src/app/services/clinica-tipo-especialidade/clinica-tipo-especialidade.service';
import { ClinicaService } from 'src/app/services/clinica/clinica.service';
import { FuncoesUteisService } from 'src/app/services/commons/funcoes-uteis.service';
import { EnderecoService } from 'src/app/services/endereco/endereco.service';
import { LoadingPopupService } from 'src/app/services/loadingPopup/loading-popup.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { TipoEspecialidadeService } from 'src/app/services/tipo-especialidade/tipo-especialidade.service';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';


class Filtro {
  tipoEspecialidade: TipoEspecialidadeCombo;  
  uf: string;
  cidade: CidadeDto;
}

@Component({
  selector: 'clinica-tipo-especialidade',
  templateUrl: '../common/pesquisa-clinicas/pesquisa-clinica.component.html',
  styleUrls: ['../common/pesquisa-clinicas/pesquisa-clinica.component.scss'],
  providers: [TelefonePipe]
})
export class ClinicaTipoEspecialidadeComponent implements OnInit {
  
  public settings: Settings;

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil;

  filtro: Filtro = new Filtro();
  clinicasCombo: ClinicaCombo[] = [];
  tipoEspecialidadesCombo: TipoEspecialidadeCombo[] = [];

  clinicasTiposEspecialidades: ClinicaTipoEspecialidadeDto[];
  tipoEspecialidades: TipoEspecialidade[];
  cidades: CidadeDto[];

  ufs: any[] = [
    {nome: 'DF'}
  ];

  cidadeDefault = 'DF';

  msg: string;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(public appSettings:AppSettings,
              private drc: ChangeDetectorRef,
              changeDetectorRef: ChangeDetectorRef,
              private enderecoService: EnderecoService,
              private funcoesUteisService: FuncoesUteisService,
              private clinicaTipoEspecialidadeService: ClinicaTipoEspecialidadeService,
              private loadingPopupService: LoadingPopupService,
              private tipoEspecialidadeService: TipoEspecialidadeService,
              private telefonePipe: TelefonePipe,
              private activatedRoute: ActivatedRoute,
              media: MediaMatcher) {

    this.carregarPerfil = new CarregarPerfil();
    this.settings = this.appSettings.settings;

    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener); 
  }

  ngOnInit(): void {
    this.carregarPerfil.carregar(this.activatedRoute.snapshot.data.perfilAcesso, this.perfilAcesso);

    this.filtro = new Filtro();
    this.filtro.tipoEspecialidade = new TipoEspecialidadeCombo();
    this.filtro.cidade = new CidadeDto();
    this.filtro.uf = 'DF';

    this.enderecoService.getAllEstados().subscribe((ufs: any) => {
      this.ufs = ufs;
    });
    
    this.tipoEspecialidadeService.getAllCombo().subscribe((tiposEspecialidade: TipoEspecialidadeCombo[]) => {
      this.tipoEspecialidadesCombo = tiposEspecialidade
    });

    this.onCarregarCidades(this.cidadeDefault);
  }

  ngAfterContentChecked(): void {
    this.drc.detectChanges();
  }

  isMobile(): boolean {
    return !this.mobileQuery.matches;
  }

  consultar() {
    this.clinicasTiposEspecialidades = [];
    this.loadingPopupService.mostrarMensagemDialog('Aguarde....');
    this.clinicaTipoEspecialidadeService.getFilter(this.filtro?.tipoEspecialidade?.id,
                                                    this.filtro.uf,
                                                    this.filtro?.cidade?.descricao
      ).subscribe((clinicasTiposEspecialidades: ClinicaTipoEspecialidadeDto[]) => {
        if (_.isEmpty(clinicasTiposEspecialidades)) {
          this.limpar();
          this.msg = 'Nenhuma clínica encontrada';
        } else {
          this.clinicasTiposEspecialidades = clinicasTiposEspecialidades;
        }
      }).add( () => this.loadingPopupService.closeDialog()  )
  }

  limpar() {
    this.msg = '';
  }

  getEndereco(registro: ClinicaTipoEspecialidadeDto) {
    return registro.endereco + ', ' + registro.bairro + ', ' + registro.cidade + ', ' + registro.uf ;
  }

  getContatoTelefonico(registro: ClinicaTipoEspecialidadeDto) {
    const celular    = registro.celular ? this.telefonePipe.transform(registro.celular) : '';
    const telefone01 = registro.telefone01 ? '  ' + this.telefonePipe.transform(registro.telefone01) : '';
    const telefone02 = registro.telefone02 ? '  ' + this.telefonePipe.transform(registro.telefone02) : '';

    return 'Telefone: ' + celular + telefone01 + telefone02;
  }

  onCarregarCidades(uf) {
    this.cidades = [];

    const p_uf = uf.value || uf;
    if(p_uf) {
      this.enderecoService.getAllBairrosPorUF(p_uf).subscribe((cidades: CidadeDto[]) => {
        this.cidades = cidades;

        this.cidades = this.funcoesUteisService.arrayDistinct(this.cidades, 'descricao');
      })
    }
  }

  
  getLogoSemFundoCartaoAmigo(){
    return '../../../assets/imagens/LOGO_CARTAO_AMIGO-V2.1-SEM-FUNDO.png';
  }
}

