import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AppSettings } from 'src/app/app.settings';
import { Settings } from 'src/app/app.settings.model';
import { ClinicaService} from 'src/app/services/clinica/clinica.service';
import { Clinica} from 'src/app/core/clinica';
import { LoadingPopupService } from 'src/app/services/loadingPopup/loading-popup.service';
import { MatTableDataSource } from '@angular/material/table';
import { ClinicaBuilder } from 'src/app/services/builder/clinica-builder';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as _ from 'lodash';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { switchMap } from 'rxjs/operators';
import { ClinicaDialogComponent } from './clinica-dialog/clinica-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MenuService } from 'src/app/services/menu/menu.service';
import { Acesso } from 'src/app/core/acesso';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';
import { ActivatedRoute } from '@angular/router';
import { TipoEspecialidadeService } from 'src/app/services/tipo-especialidade/tipo-especialidade.service';
import { TipoEspecialidade } from 'src/app/core/tipo-especialidade';
import { ClinicaCombo } from 'src/app/core/clinica-combo';
import { TipoEspecialidadeCombo } from 'src/app/core/tipo-especialidade-combo';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { ClinicaDto } from 'src/app/core/clinica-dto';





class Filtro {
  clinica: ClinicaCombo
  bairro: string;
  tipoEspecialidade: TipoEspecialidadeCombo;
  dataInicio: Date;
  dataFim: Date;
  ativo: string;  
}

@Component({
  selector: 'clinicas',
  templateUrl: './clinicas.component.html',
  styleUrls: ['./clinicas.component.scss']
})
export class ClinicasComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public settings: Settings;

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil;

  filtro: Filtro = new Filtro();
  mostrarTabela = false;

  clinicasCombo: ClinicaCombo[] = [];
  tipoEspecialidadesCombo: TipoEspecialidadeCombo[] = [];

  clinicas: ClinicaDto[];
  tipoEspecialidades: TipoEspecialidade[];

  displayedColumns: string[] = ['nomeRazaoSocial','cnpj','email', 'cidade', 'bairro', 'uf', 'ativo', 'dataCadastro', 'acoes'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  msg: string;

  sim_nao: any[] = [
    {tipo: 'Sim', flag: 'S'},
    {tipo: 'Não', flag: 'N'}
  ];  

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(public appSettings:AppSettings,
              private drc: ChangeDetectorRef,
              changeDetectorRef: ChangeDetectorRef,
              private dataUtilService: DataUtilService,
              private clinicaService:ClinicaService,
              private loadingPopupService: LoadingPopupService,
              private tipoEspecialidadeService: TipoEspecialidadeService,
              private menuService: MenuService,
              private clinicaBuilder: ClinicaBuilder,
              private dialog: MatDialog,
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
    this.filtro.clinica = new ClinicaCombo();


    this.tipoEspecialidadeService.getAll().subscribe((tipoEspecialidades: TipoEspecialidade[]) => {
      this.tipoEspecialidades = tipoEspecialidades;
    });

    this.clinicaService.getAllCombo().subscribe((clinicas: ClinicaCombo[]) => {
      this.clinicasCombo = clinicas;
    })

    this.tipoEspecialidadeService.getAllCombo().subscribe((tiposEspecialidade: TipoEspecialidadeCombo[]) => {
      this.tipoEspecialidadesCombo = tiposEspecialidade
    })

    this.consultar();
  }

  ngAfterContentChecked(): void {
    this.drc.detectChanges();
  }

  isMobile(): boolean {
    return !this.mobileQuery.matches;
  }


  getBackground() {
    return '../../assets/img/Construcao.png';
  }


  consultar() {
    this.loadingPopupService.mostrarMensagemDialog('Aguarde....');
    this.clinicaService.getFilter(this.filtro.clinica?.id, 
                                  this.filtro.tipoEspecialidade?.id,
                                  this.filtro.bairro,
                                  this.filtro.ativo,
                                  this.filtro.dataInicio,
                                  this.filtro.dataFim
      ).subscribe((clinicas: ClinicaDto[]) => {
        if (_.isEmpty(clinicas)) {
          this.limpar();
          this.msg = 'Nenhum registro para a pesquisa selecionada';
        } else {
          this.clinicas = clinicas;

          this.dataSource.data = this.clinicas;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          
          this.mostrarTabela = true;
        }
      }).add( () => this.loadingPopupService.closeDialog()  )
  }

  atualizar(clinica: ClinicaDto) {
    this.showDialogClinica(clinica);
  }

  deletar(clinica: ClinicaDto) {
    this.chamaCaixaDialogo(clinica);
  }

  
  chamaCaixaDialogo(clinica: ClinicaDto) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: 'Certeza que deseja excluir ?',
      textoConfirma: 'SIM',
      textoCancela: 'NÃO'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        this.clinicaService.excluir(clinica.idClinica).subscribe(() => {
          this.consultar();
        })
      } else {
        dialogRef.close();
      }
    });
  }

  limpar() {
    this.dataSource.data = [];
    this.mostrarTabela = false;
    this.msg = '';
  }

  showDialogNewClinica() {
    this.showDialogClinica(null);
  }


  showDialogClinica(clinica: ClinicaDto) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      idClinica: clinica?.idClinica,
      tipoEspecialidades: this.tipoEspecialidades,
      perfilAcesso: this.perfilAcesso
    };
    dialogConfig.panelClass = 'configuracaoDialogClinica';
    

    const dialogRef = this.dialog.open(ClinicaDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        this.consultar();
      } else {
        dialogRef.close();
      }
    });
  }


  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }
}

