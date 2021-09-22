import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSettings } from 'src/app/app.settings';
import { Settings } from 'src/app/app.settings.model';
import { Acesso } from 'src/app/core/acesso';
import { Usuario } from 'src/app/core/usuario';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';
import { PessoaFisica } from 'src/app/core/pessoa-fisica';
import { TipoUsuario } from 'src/app/core/tipo-usuario';
import { UsuarioSistema } from 'src/app/core/usuario-sistema';
import { UsuarioSistemaBuilder } from 'src/app/services/builder/usuario-sistema-builder';
import { LoadingPopupService } from 'src/app/services/loadingPopup/loading-popup.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import * as _ from 'lodash';
import { UsuarioCombo } from 'src/app/core/usuario-combo';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { switchMap } from 'rxjs/operators';
import { UsuarioDialogComponent } from './usuario-dialog/usuario-dialog.component';
import { GrupoAcesso } from 'src/app/core/grupo-acesso';
import { GrupoAcessoService } from 'src/app/services/grupo-acesso/grupo-acesso.service';
import { UsuarioBuilder } from 'src/app/services/builder/usuario-builder';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { UsuarioDto } from 'src/app/core/usuario-dto';
import { AutenticadorService } from 'src/app/services/autenticador/autenticador.service';
import { UsuarioSistemaService } from 'src/app/services/usuario-sistema/usuario-sistema.service';


class Filtro {
  usuario : UsuarioCombo
  dataInicioCadastro: Date;
  dataFimCadastro: Date;
  ativo: string;
}

@Component({
  selector: 'usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public settings: Settings;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil  = new CarregarPerfil();  

  usuarioSistema: UsuarioSistema = new UsuarioSistema();
  usuariosSistema: UsuarioSistema[];

  filtro: Filtro = new Filtro();

  mostrarBotaoCadastrar = true
  mostrarBotaoAtualizar = true;
  isAtualizar = false;

  usuariosCombo: UsuarioCombo[] = [];

  usuario: Usuario = new Usuario();
  usuarios: Usuario[];

  mostrarTabela = false;

  displayedColumns: string[] = ['nome','email','cpf', 'dataCadastro','ativo', 'descTipoUsuario', 'acoes'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  msg: string;

  sim_nao: any[] = [
    {tipo: 'Sim', flag: 'S'},
    {tipo: 'Não', flag: 'N'}
  ];  

  grupoAcessoAdministrativo: GrupoAcesso[];

  constructor(public appSettings:AppSettings,
              private drc: ChangeDetectorRef,
              changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              private activatedRoute: ActivatedRoute,
              private dataUtilService: DataUtilService,
              public autenticadorService: AutenticadorService,
              private grupoAcessoService: GrupoAcessoService,
              private loadingPopupService: LoadingPopupService,
              private dialog: MatDialog,
              public usuarioSistemaBuilder: UsuarioSistemaBuilder,
              public usuarioBuilder: UsuarioBuilder,
              public usuarioService: UsuarioService) {

      this.carregarPerfil = new CarregarPerfil();                
      this.settings = this.appSettings.settings;
      
      this.mobileQuery = media.matchMedia('(min-width: 768px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener); 
  }
              
  ngOnInit(): void {
    this.carregarPerfil.carregar(this.activatedRoute.snapshot.data.perfilAcesso, this.perfilAcesso);

    if(!this.perfilAcesso.insere){this.mostrarBotaoCadastrar = false;}
    if(!this.perfilAcesso.altera){this.mostrarBotaoAtualizar = false;}

    this.filtro = new Filtro();
    this.filtro.usuario = new UsuarioCombo();

    this.usuarioSistema = new UsuarioSistema();
    this.usuarioSistema.pessoaFisica = new PessoaFisica();

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.connect();

    this.consultar();

    this.usuarioService.getAllCombo().subscribe((usuarios: UsuarioCombo[]) => {
      this.usuariosCombo = usuarios;
    })

    this.grupoAcessoService.getGrupoAcessoAdministrativo().subscribe((grupos: GrupoAcesso[]) => {
      this.grupoAcessoAdministrativo = grupos;
    })

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngAfterContentChecked(): void {
    this.drc.detectChanges();
  }

  isMobile(): boolean {
    return !this.mobileQuery.matches;
  }



  mostrarBotaoLimpar(){
    if(this.isAtualizar) return false;
    if(!this.mostrarBotaoAtualizar) return false;
    if(!this.mostrarBotaoCadastrar) return false;

    return true;
  }

  limpar() {
    this.filtro = new Filtro();

    this.usuarioSistema = new UsuarioSistema();
    this.usuarioSistema.tipoUsuario = new TipoUsuario();
    this.usuarioSistema.pessoaFisica = new PessoaFisica();

    this.dataSource.data = [];
    this.mostrarTabela = false;
    this.msg = '';
  }


  fechar() {    
  }

  consultar() {
    this.loadingPopupService.mostrarMensagemDialog('Aguarde....');
    this.usuarioService.getFilter(this.filtro.usuario?.id,
                                  this.filtro.ativo,  
                                  this.filtro.dataInicioCadastro,
                                  this.filtro.dataFimCadastro
      ).subscribe((usuarios: Usuario[]) => {
        if (_.isEmpty(usuarios)) {
          this.limpar();
          this.msg = 'Nenhum registro para a pesquisa selecionada';
        } else {
          this.usuarios = usuarios;

          this.dataSource.data      = this.usuarios;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort      = this.sort;          
          this.mostrarTabela = true;
        }
      }).add( () => this.loadingPopupService.closeDialog()  )
  }



  atualizar(usuarioDto: UsuarioDto) {
    this.showDialog(usuarioDto);
  }

  deletar(usuarioDto: UsuarioDto) {
    this.chamaCaixaDialogo(usuarioDto);
  }


  chamaCaixaDialogo(usuarioDto: UsuarioDto) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: 'Certeza que deseja excluir ?',
      textoConfirma: 'SIM',
      textoCancela: 'NÃO'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        this.loadingPopupService.mostrarMensagemDialog('Excluindo....');
        this.usuarioService.excluir(usuarioDto.idUsuario).subscribe(() => {
          this.consultar();
        }).add( () => this.loadingPopupService.closeDialog()  );
      } else {
        dialogRef.close();
      }
    });
  }



  showDialogNew() {
    this.showDialog(null);
  }


  showDialog(usuarioDto: UsuarioDto) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      idUsuarioSistema: usuarioDto?.idUsuario,
      perfilAcesso: this.perfilAcesso,
      grupoAcessoAdministrativo: this.grupoAcessoAdministrativo,
      usuarioLogado: this.autenticadorService.usuarioLogado
    };
    dialogConfig.panelClass = 'configuracaoDialogUsuarioSistema';    

    const dialogRef = this.dialog.open(UsuarioDialogComponent, dialogConfig);
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
