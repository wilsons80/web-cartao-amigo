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
import { Associados } from 'src/app/core/associados';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';
import { TitularCombo } from 'src/app/core/titular-combo';
import { AssociadosService } from 'src/app/services/associados/associados.service';
import { LoadingPopupService } from 'src/app/services/loadingPopup/loading-popup.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import * as _ from 'lodash';
import { AssociadoDialogComponent } from './associado-dialog/associado-dialog.component';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { CpfPipe } from 'src/app/pipes/cpf.pipe';
import { TitularService } from 'src/app/services/titular/titular.service';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { SessaoService } from 'src/app/services/sessao/sessao.service';



class Filtro {
  nomeUsuario: string;
  titular: TitularCombo;
  ativo: string;
  dataInicio: Date;
  dataFim: Date;
}

@Component({
  selector: 'associados',
  templateUrl: './associados.component.html',
  styleUrls: ['./associados.component.scss'],
  providers: [CpfPipe]
})
export class AssociadosComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil  = new CarregarPerfil();  

  associados: Associados[];
  titulares: TitularCombo[] = [];

  filtro: Filtro = new Filtro();

  mostrarBotaoCadastrar = true
  mostrarBotaoAtualizar = true;
  isAtualizar = false;

  mostrarTabela = false;
  
  displayedColumns: string[] = ['nome', 'cpf', 'ativo', 'email', 'dataCadastro', 'acoes'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  msg: string;

  sim_nao: any[] = [
    {tipo: 'Sim', flag: 'S'},
    {tipo: 'Não', flag: 'N'}
  ];  

  public settings: Settings;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(public appSettings:AppSettings,
              private drc: ChangeDetectorRef,
              private dataUtilService: DataUtilService,
              private associadosService: AssociadosService,
              private titularService: TitularService,
              changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              private activatedRoute: ActivatedRoute,
              private toastService: ToastService,
              private router: Router,
              private loadingPopupService: LoadingPopupService,
              private dialog: MatDialog,
              private cpfPipe: CpfPipe,
              private sessaoService: SessaoService
              ) {

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

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.connect();

    this.associadosService.getAllCombo().subscribe((titulares: TitularCombo[]) => {
      this.titulares = titulares;
      if(this.titulares) {
        this.titulares.forEach(t => t.descricaoCombo = t.nome + ' - ' + this.cpfPipe.transform(t.cpf));
      }
    })

    this.consultar();
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


  getBackground() {
    return '../../assets/img/Construcao.png';
  }


  mostrarBotaoLimpar(){
    if(this.isAtualizar) return false;
    if(!this.mostrarBotaoAtualizar) return false;
    if(!this.mostrarBotaoCadastrar) return false;

    return true;
  }

  limpar() {
    this.filtro = new Filtro();
    this.filtro.titular = new TitularCombo();

    this.dataSource.data = [];
    this.mostrarTabela = false;
    this.msg = '';
  }


  
  consultar() {
    this.loadingPopupService.mostrarMensagemDialog('Aguarde....');
    this.associadosService.getFilter(this.filtro.titular?.id, 
                                     this.filtro.ativo, 
                                     this.filtro.dataInicio, 
                                     this.filtro.dataFim)
      .subscribe((associados: Associados[]) => {
        if (_.isEmpty(associados)) {
          this.mostrarTabela = false;
          this.msg = '';
          this.msg = 'Nenhum registro para a pesquisa selecionada';
        } else {                    
          this.mostrarTabela = true;
        }
        
        this.associados = associados || [];
        this.dataSource.data = this.associados;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }).add( () => this.loadingPopupService.closeDialog()  )
  }


  atualizar(associados: Associados) {
    this.showDialog(associados);
  }

  showDialog(associado: Associados) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      associado: associado,
      perfilAcesso: this.perfilAcesso,
    };
    dialogConfig.panelClass = 'configuracaoDialogAssociados';

    const dialogRef = this.dialog.open(AssociadoDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        this.consultar();
      } else {
        dialogRef.close();
      }
    });
  }

  excluirAssociado(associado: Associados) {
    this.chamaCaixaDialogo(associado.idTitular);
  }
  
  chamaCaixaDialogo(idTitular) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: 'Certeza que deseja excluir definitivamente ?',
      textoConfirma: 'SIM',
      textoCancela: 'NÃO'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        this.titularService.excluirSemPagamento(idTitular).subscribe(() => {
          this.toastService.showSucesso('Associado excluído com sucesso.');
          this.consultar();
        })
      } else {
        dialogRef.close();
      }
    });
  }
  
  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }
}
