import { SelectionModel } from '@angular/cdk/collections';
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { AppSettings } from 'src/app/app.settings';
import { Settings } from 'src/app/app.settings.model';
import { Acesso } from 'src/app/core/acesso';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';
import { ComboAssociado } from 'src/app/core/combo-associado';
import { ImpressaoCartao } from 'src/app/core/impressao-cartao';
import { CpfPipe } from 'src/app/pipes/cpf.pipe';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { FuncoesUteisService } from 'src/app/services/commons/funcoes-uteis.service';
import { ImpressaoCartaoService } from 'src/app/services/impressao-cartao/impressao-cartao.service';
import { LoadingPopupService } from 'src/app/services/loadingPopup/loading-popup.service';
import { PessoaFisicaService } from 'src/app/services/pessoa-fisica/pessoa-fisica.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { FileUtils } from 'src/app/utils/file-utils';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';



export class Filter{
  associado: ComboAssociado;
  numeroCartao: string;
  impresso: string;
  tipoAssociado: string;
  dataInicioGerado: Date;
  dataFimGerado: Date;
  dataInicioImpresso: Date;
  dataFimImpresso: Date;
}


@Component({
  selector: 'associados',
  templateUrl: './impressao-cartao.component.html',
  styleUrls: ['./impressao-cartao.component.scss'],
  providers: [CpfPipe],
})
export class ImpressaoCartaoComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  comboAssociados: ComboAssociado[];

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil;

  displayedColumns: string[] = ['select', 'numeroCartao','nomeAssociado', 'isTitular' ,'bloqueado','dataImpressao', 'dataGeracao', 'dataFimValidade'];
  dataSource: MatTableDataSource<ImpressaoCartao> = new MatTableDataSource();
  mostrarTabela: boolean = false;
  msg: string;

  selection = new SelectionModel<ImpressaoCartao>(true, []);

  filtro: Filter = new Filter();
  impressaoCartoes: ImpressaoCartao[]

  sim_nao: any[] = [
    {tipo: 'Sim', flag: 'S'},
    {tipo: 'Não', flag: 'N'}
  ];  

  tiposAssociados: any[] = [
    {tipo: 'Titular', flag: 'T'},
    {tipo: 'Dependente', flag: 'D'}
  ];  

  public settings: Settings;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(public appSettings:AppSettings,
              private drc: ChangeDetectorRef,
              changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              private activatedRoute: ActivatedRoute,
              private fileUtils: FileUtils,
              private dialog: MatDialog,
              private loadingPopupService: LoadingPopupService,          
              private cpfPipe: CpfPipe,
              private dataUtilService: DataUtilService,
              private funcoesUteisService: FuncoesUteisService,
              private pessoaFisicaService: PessoaFisicaService,
              private impressaoCartaoService: ImpressaoCartaoService,
              private toastService: ToastService) {

    this.carregarPerfil = new CarregarPerfil();            
    this.settings = this.appSettings.settings;

    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener); 
  }

  ngOnInit(): void {
    this.carregarPerfil.carregar(this.activatedRoute.snapshot.data.perfilAcesso, this.perfilAcesso);

    this.limpar();


    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.carregarCombos();
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

  private carregarCombos(){
    this.pessoaFisicaService.getAllAssociadosByCombo().subscribe((associados: ComboAssociado[]) => {
      this.comboAssociados = associados;
    });
  }

  consultar() {
    this.impressaoCartaoService.getFilter(this.filtro.associado.id,
                                          this.filtro.numeroCartao,
                                          this.filtro.impresso,
                                          this.filtro.tipoAssociado,
                                          this.filtro.dataInicioGerado,
                                          this.filtro.dataFimGerado,
                                          this.filtro.dataInicioImpresso,
                                          this.filtro.dataFimImpresso,)
      .subscribe((cartoes: ImpressaoCartao[]) => {
      this.impressaoCartoes = cartoes;
      
      this.dataSource.data = cartoes ? cartoes : [];
      this.verificaMostrarTabela(cartoes);

      this.selection.clear();
      this.dataSource.data.forEach(row => this.selection.select(row));
      
    })
  }

  verificaMostrarTabela(lista: ImpressaoCartao[]) {
    if (!lista || lista.length == 0) {
      this.mostrarTabela = false;
      this.msg = "Nenhuma cartão encontrado."
    } else {
      this.mostrarTabela = true;
    }
  }

  public handlePageBottom(event: PageEvent) {
    this.paginator.pageSize = event.pageSize;
    this.paginator.pageIndex = event.pageIndex;
    this.paginator.page.emit(event);
  }
  
    
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }


  limpar() {
    this.filtro = new Filter();
    this.filtro.associado  = new ComboAssociado();

    this.selection.clear();
    this.impressaoCartoes = [];
    this.dataSource.data = [];
  }


  gerarCartao() {
    if(this.selection.selected && this.selection.selected.length === 0) {
      this.toastService.showAlerta('Selecione pelo menos um cartão.');
      return;
    }

    const listaDadosExportacao = this.selection.selected;
    this.chamaCaixaDialogoCartao(listaDadosExportacao);    
  }

  
  gerarCartaBoasVindas() {
    if(this.selection.selected && this.selection.selected.length === 0) {
      this.toastService.showAlerta('Selecione pelo menos um cartão.');
      return;
    }

    const listaDadosExportacao = this.selection.selected;
    this.chamaCaixaDialogoCartaBoasVindas(listaDadosExportacao);    
  }
  
  
  chamaCaixaDialogoCartao(listaCompletaDadosExportar: ImpressaoCartao[]) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: `Certeza que deseja imprimir ?`,
      textoConfirma: 'SIM',
      textoCancela: 'NÃO'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        this.loadingPopupService.mostrarMensagemDialog('Processando, aguarde...');

        let bytesArquivoCartao;
        this.impressaoCartaoService.gerarArquivo(listaCompletaDadosExportar).pipe(
          tap((bytesCartao: any) => {bytesArquivoCartao = bytesCartao}),
          switchMap(() => this.impressaoCartaoService.gerarCartaBoasVindas(listaCompletaDadosExportar))
        ).subscribe((bytesRelatorioBoasVindas: any) => {

          const nomeRelatorioCartoes = "cartao-amigo_" + this.dataUtilService.dateAsYYYYMMDDHHNNSS(new Date()) + ".pdf";
          this.fileUtils.downloadFilePDF(bytesArquivoCartao, nomeRelatorioCartoes);
          
          const nomeRelatoioBoasVindas = "boas-vindas_" + this.dataUtilService.dateAsYYYYMMDDHHNNSS(new Date()) + ".pdf";
          this.fileUtils.downloadFilePDF(bytesRelatorioBoasVindas, nomeRelatoioBoasVindas);

          this.toastService.showSucesso('Operação realizada com sucesso!');
        }, 
        (error) => {
        }).add(() => {this.loadingPopupService.closeDialog();}) 
             
      } else {
        dialogRef.close();
      }
    });
  }


  chamaCaixaDialogoCartaBoasVindas(listaCompletaDadosExportar: ImpressaoCartao[]) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: `Certeza que deseja gerar ?`,
      textoConfirma: 'SIM',
      textoCancela: 'NÃO'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        this.loadingPopupService.mostrarMensagemDialog('Processando, aguarde...');

        this.impressaoCartaoService.gerarCartaBoasVindas(listaCompletaDadosExportar)
        .subscribe((bytesRelatorioBoasVindas: any) => {

          const nomeRelatoioBoasVindas = "boas-vindas_" + this.dataUtilService.dateAsYYYYMMDDHHNNSS(new Date()) + ".pdf";
          this.fileUtils.downloadFilePDF(bytesRelatorioBoasVindas, nomeRelatoioBoasVindas);
          this.toastService.showSucesso('Cartas geradas com sucesso!');
        }, 
        (error) => {
        }) .add(() => {this.loadingPopupService.closeDialog();})      
             
      } else {
        dialogRef.close();
      }
    });
  }



  onValorChange(event: any) {
    this.filtro.associado = event;
  }


  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }

}
