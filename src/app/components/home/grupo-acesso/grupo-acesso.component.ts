import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Acesso } from 'src/app/core/acesso';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';
import { GrupoAcesso } from 'src/app/core/grupo-acesso';
import { Menu } from 'src/app/core/menu';
import { Modulo } from 'src/app/core/modulo';
import { PerfilAcesso } from 'src/app/core/perfil-acesso';
import { ControleMenuService } from 'src/app/services/controle-menu/controle-menu.service';
import { GrupoAcessoService } from 'src/app/services/grupo-acesso/grupo-acesso.service';
import { LoadingPopupService } from 'src/app/services/loadingPopup/loading-popup.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { ModuloService } from 'src/app/services/modulo/modulo.service';
import { PerfilAcessoService } from 'src/app/services/perfil-acesso/perfil-acesso.service';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import * as _ from 'lodash';
import { MatSort } from '@angular/material/sort';
import { GrupoAcessoBuilder } from 'src/app/services/builder/grupo-acesso-builder';
import { GrupoAcessoDialogComponent } from './grupo-acesso-dialog/grupo-acesso-dialog.component';

class Filtro {
  nomeGrupoAceso: string;
  modulo: Modulo;
}


@Component({
  selector: 'grupo-acesso',
  templateUrl: './grupo-acesso.component.html',
  styleUrls: ['./grupo-acesso.component.scss']
})
export class GrupoAcessoComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  grupoAceso: GrupoAcesso = new GrupoAcesso();
  gruposAceso: any[];
  perfilsAcesso: PerfilAcesso[];
  modulosFilhos: Modulo[];

  filtro: Filtro = new Filtro();

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil;

  mostrarTabela = false;
  
  displayedColumns: string[] = ['nomeGrupoAcesso', 'descricaoPerfilAcesso', 'acoes'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  msg: string;


  constructor(private grupoAcessoService: GrupoAcessoService,
              private perfilAcessoService: PerfilAcessoService,
              private moduloService: ModuloService,
              private loadingPopupService: LoadingPopupService,
              private dialog: MatDialog,
              private menuService: MenuService,
              public controleMenuService: ControleMenuService,
              private grupoAcessoBuilder: GrupoAcessoBuilder,
              private activatedRoute: ActivatedRoute,) { 
    this.carregarPerfil = new CarregarPerfil();                
  }


  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.carregarPerfil.carregar(this.activatedRoute.snapshot.data.perfilAcesso, this.perfilAcesso);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.connect();

    this.buscarTodosPerfilsAcesso();
    this.buscarTodosModulosFilhos();

    this.consultar();
  }


  buscarTodosModulosFilhos(){
    this.moduloService.getAllModuloAdministrativoFilhos().subscribe((modulosFilhos: Modulo[]) => { 
      this.modulosFilhos = modulosFilhos;
    });
  }

  buscarTodosPerfilsAcesso(){
    this.perfilAcessoService.getAll().subscribe((perfis: PerfilAcesso[]) => { 
      this.perfilsAcesso = perfis;
    });
  }

  consultar() {
    this.loadingPopupService.mostrarMensagemDialog('Aguarde....');
    this.grupoAcessoService.getFiltro(this.filtro.nomeGrupoAceso, this.filtro.modulo?.id)
      .subscribe((gruposAcesso: GrupoAcesso[]) => {
        if (_.isEmpty(gruposAcesso)) {
          this.limpar();
          this.msg = 'Nenhum registro para a pesquisa selecionada';
        } else {
          this.gruposAceso = gruposAcesso.map(ga => this.grupoAcessoBuilder.build(ga));

          this.dataSource.data = this.gruposAceso;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          
          this.mostrarTabela = true;
        }
      }).add( () => this.loadingPopupService.closeDialog()  )
  }

  atualizar(grupo: GrupoAcesso) {
    this.showDialogGrupoAcesso(grupo);
  }

  deletar(grupo: GrupoAcesso) {
    this.chamaCaixaDialogo(grupo);
  }


  chamaCaixaDialogo(grupo: GrupoAcesso) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: 'Certeza que deseja excluir ?',
      textoConfirma: 'SIM',
      textoCancela: 'NÃO'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        this.grupoAcessoService.excluir(grupo.id).
        subscribe(() => {
          this.consultar();
        })
      } else {
        dialogRef.close();
      }
    });
  }

  limpar() {
    this.filtro = new Filtro();
    this.dataSource.data = [];
    this.mostrarTabela = false;
    this.msg = '';
    this.grupoAceso = new GrupoAcesso();
  }

  showDialogNewGrupoAcesso() {
    this.showDialogGrupoAcesso(null);
  }


  showDialogGrupoAcesso(grupo: GrupoAcesso) {
    if(!grupo) {
      this.grupoAceso = new GrupoAcesso();
    } else {
      this.grupoAceso = grupo;
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      grupoAcesso: this.grupoAceso,
      modulos: this.modulosFilhos,
      perfilAcesso: this.perfilAcesso
    };
    dialogConfig.panelClass = 'configuracaoDialogGrupoAcesso';
    

    const dialogRef = this.dialog.open(GrupoAcessoDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        this.consultar();
      } else {
        dialogRef.close();
      }
    });
  }

}
