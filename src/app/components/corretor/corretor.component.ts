import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AppSettings } from 'src/app/app.settings';
import { Settings } from 'src/app/app.settings.model';
import { LoadingPopupService } from 'src/app/services/loadingPopup/loading-popup.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as _ from 'lodash';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { CorretorDialogComponent } from './corretor-dialog/corretor-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Acesso } from 'src/app/core/acesso';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';
import { ActivatedRoute } from '@angular/router';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { CorretorCombo } from 'src/app/core/corretor-combo';
import { CorretorDto } from 'src/app/core/corretor-dto';
import { CorretorService } from 'src/app/services/corretor/corretor.service';
import { AutorizacaoService } from 'src/app/services/autorizacao/autorizacao.service';
import { Autorizacao } from 'src/app/core/autorizacao';


class Filtro {
  corretor: CorretorCombo
  dataInicio: Date;
  dataFim: Date;
  ativo: string;  
}

@Component({
  selector: 'corretor',
  templateUrl: './corretor.component.html',
  styleUrls: ['./corretor.component.scss']
})
export class CorretorComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public settings: Settings;

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil;

  filtro: Filtro = new Filtro();
  mostrarTabela = false;

  corretoresCombo: CorretorCombo[] = [];
  corretores: CorretorDto[];
  

  displayedColumns: string[] = ['nome','cpf','email', 'ativo', 'dataCadastro','codigoAutorizacao', 'acoes'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  msg: string;

  sim_nao: any[] = [
    {tipo: 'Sim', flag: 'S'},
    {tipo: 'Não', flag: 'N'}
  ];  

  autorizacao: Autorizacao;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(public appSettings:AppSettings,
              private drc: ChangeDetectorRef,
              changeDetectorRef: ChangeDetectorRef,
              private dataUtilService: DataUtilService,
              private corretorService: CorretorService,
              private autorizacaoService: AutorizacaoService,
              private loadingPopupService: LoadingPopupService,
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
    this.filtro.corretor = new CorretorCombo();
    this.autorizacao = new Autorizacao();

    this.corretorService.getAllCombo().subscribe((corretoresCombo: CorretorCombo[]) => {
      this.corretoresCombo = corretoresCombo;

      if(this.corretoresCombo) {
        this.corretoresCombo.forEach(c => c.nome_codigo = c.nome + ' - ' + c.codigo);
      }
    })

    this.autorizacaoService.getAll().subscribe((autorizacoes: Autorizacao[]) => {
      this.autorizacao = !_.isEmpty(autorizacoes) ? autorizacoes[0] : null;
    });

    this.consultar();
  }

  ngAfterContentChecked(): void {
    this.drc.detectChanges();
  }

  isMobile(): boolean {
    return !this.mobileQuery.matches;
  }


  consultar() {
    this.loadingPopupService.mostrarMensagemDialog('Aguarde....');
    this.corretorService.getFilter(this.filtro.corretor.id, 
                                  this.filtro.ativo,
                                  this.filtro.dataInicio,
                                  this.filtro.dataFim
      ).subscribe((corretores: CorretorDto[]) => {
        if (_.isEmpty(corretores)) {
          this.limpar();
          this.msg = 'Nenhum registro para a pesquisa selecionada';
        } else {
          this.corretores = corretores;

          this.dataSource.data = this.corretores;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          
          this.mostrarTabela = true;
        }
      }).add( () => this.loadingPopupService.closeDialog()  )
  }

  atualizar(corretor: CorretorDto) {
    this.showDialog(corretor);
  }

  deletar(corretor: CorretorDto) {
    this.chamaCaixaDialogo(corretor);
  }
  
  chamaCaixaDialogo(corretor: CorretorDto) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: 'Certeza que deseja excluir ?',
      textoConfirma: 'SIM',
      textoCancela: 'NÃO'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        this.corretorService.excluir(corretor.id).subscribe(() => {
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

  showDialogNew() {
    this.showDialog(null);
  }


  showDialog(corretor: CorretorDto) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      idCorretor: corretor?.id,
      perfilAcesso: this.perfilAcesso,
      urlAutorizacao: this.autorizacao.urlAutorizacao
    };
    dialogConfig.panelClass = 'configuracaoDialogClinica';
    

    const dialogRef = this.dialog.open(CorretorDialogComponent, dialogConfig);
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

