import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { TipoEspecialidadeService } from 'src/app/services/tipo-especialidade/tipo-especialidade.service';
import { TipoEspecialidade } from 'src/app/core/tipo-especialidade';
import { MatTableDataSource } from '@angular/material/table';
import { LoadingPopupService } from 'src/app/services/loadingPopup/loading-popup.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as _ from 'lodash';
import { Acesso } from 'src/app/core/acesso';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { AppSettings } from 'src/app/app.settings';
import { Settings } from 'src/app/app.settings.model';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { TipoEspecialidadeDialogComponent } from './tipo-especialidade-dialog/tipo-especialidade-dialog.component';



@Component({
  selector: 'tipo-especialidade',
  templateUrl: './tipo-especialidade.component.html',
  styleUrls: ['./tipo-especialidade.component.scss']
})
export class TipoEspecialidadeComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public settings: Settings;

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil;

  tipoEspecialidadesCombo: TipoEspecialidade[] = [];
  tipoEspecialidades: TipoEspecialidade[];
  tipoEspecialidade: TipoEspecialidade;

  displayedColumns: string[] = ['descricao', 'acoes'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  msg: string;
  mostrarTabela = false;

  
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  

  constructor(public appSettings:AppSettings,
              private drc: ChangeDetectorRef,
              changeDetectorRef: ChangeDetectorRef,
              private dataUtilService: DataUtilService,
              private loadingPopupService: LoadingPopupService,
              private tipoEspecialidadeService: TipoEspecialidadeService,
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
    this.tipoEspecialidade = new TipoEspecialidade();

    this.tipoEspecialidadeService.getAll().subscribe((tipoEspecialidades: TipoEspecialidade[]) => {
      this.tipoEspecialidadesCombo = tipoEspecialidades;
    });

    this.buscarTodos();
  }

  consultar() {
    this.loadingPopupService.mostrarMensagemDialog('Aguarde....');
    if(this.tipoEspecialidade && this.tipoEspecialidade.id) {
      this.buscarPorId();
    } else {
      this.buscarTodos();
    }
  }

  private buscarPorId() {
    this.tipoEspecialidadeService.getById(this.tipoEspecialidade.id)
    .subscribe((tipoEspecialidade: TipoEspecialidade) => {
      if (!tipoEspecialidade) {
        this.limpar();
        this.msg = 'Nenhum registro encontrado.';
      } else {
        this.tipoEspecialidades = [tipoEspecialidade]
        this.dataSource.data = this.tipoEspecialidades;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
        this.mostrarTabela = true;
      }
    }).add( () => this.loadingPopupService.closeDialog()  )
  }


  private buscarTodos() {
    this.tipoEspecialidadeService.getAll().subscribe((tipoEspecialidades: TipoEspecialidade[]) => {
      if (_.isEmpty(tipoEspecialidades)) {
        this.limpar();
        this.msg = 'Nenhum registro encontrado.';
      } else {
        this.tipoEspecialidades = tipoEspecialidades
        this.dataSource.data = this.tipoEspecialidades;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
        this.mostrarTabela = true;
      }
    }).add( () => this.loadingPopupService.closeDialog()  )
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
    
  atualizar(tipoEspecialidades: TipoEspecialidade) {
    this.showDialog(tipoEspecialidades);
  }

  deletar(tipoEspecialidades: TipoEspecialidade) {
    this.chamaCaixaDialogo(tipoEspecialidades);
  }

  
  chamaCaixaDialogo(tipoEspecialidades: TipoEspecialidade) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: 'Certeza que deseja excluir ?',
      textoConfirma: 'SIM',
      textoCancela: 'NÃO'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        this.tipoEspecialidadeService.excluir(tipoEspecialidades.id).subscribe(() => {
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
    this.tipoEspecialidade = new TipoEspecialidade();
  }

  showDialogNew() {
    this.showDialog(null);
  }


  showDialog(tipoEspecialidades: TipoEspecialidade) {  
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      idTipoEspecialidade: tipoEspecialidades?.id,
      tipoEspecialidades: this.tipoEspecialidades,
      perfilAcesso: this.perfilAcesso
    };
    dialogConfig.panelClass = 'configuracaoDialogClinica';    

    const dialogRef = this.dialog.open(TipoEspecialidadeDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        this.buscarTodos();
      } else {
        dialogRef.close();
      }
    });
  }


  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }

}
