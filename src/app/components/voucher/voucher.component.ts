import { SelectionModel } from '@angular/cdk/collections';
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { AppSettings } from 'src/app/app.settings';
import { Settings } from 'src/app/app.settings.model';
import { Acesso } from 'src/app/core/acesso';
import { CarregarPerfil } from 'src/app/core/carregar-perfil';
import { ComboAssociado } from 'src/app/core/combo-associado';
import { ImpressaoCartao } from 'src/app/core/impressao-cartao';
import { Voucher } from 'src/app/core/voucher';
import { VoucherDto } from 'src/app/core/voucher-dto';
import { CpfPipe } from 'src/app/pipes/cpf.pipe';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { FuncoesUteisService } from 'src/app/services/commons/funcoes-uteis.service';
import { ImpressaoCartaoService } from 'src/app/services/impressao-cartao/impressao-cartao.service';
import { LoadingPopupService } from 'src/app/services/loadingPopup/loading-popup.service';
import { PessoaFisicaService } from 'src/app/services/pessoa-fisica/pessoa-fisica.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { VoucherService } from 'src/app/services/voucher/voucher.service';
import { FileUtils } from 'src/app/utils/file-utils';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { VoucherDialogComponent } from './voucher-dialog/voucher-dialog.component';


export class Filter {
  codigo: string;
  ativo: string;
  utilizado: string;
  dataInicioGerado: Date;
  dataFimGerado: Date;
}

@Component({
  selector: 'voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss'],
  providers: [CpfPipe],
})
export class VoucherComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  perfilAcesso: Acesso = new Acesso();
  carregarPerfil: CarregarPerfil;

  displayedColumns: string[] = ['select', 'codigo','descricaoPromocao','porcentagem','dataCriacao', 'dataValidade', 'ativo', 'utilizado', 'dataUtilizacao','nomePessoaUlilizacao', 'qtdMesesDesconto', 'acoes'];
  dataSource: MatTableDataSource<VoucherDto> = new MatTableDataSource();
  mostrarTabela: boolean = false;
  msg: string;

  selection = new SelectionModel<VoucherDto>(true, []);

  filtro: Filter = new Filter();
  vouchers: VoucherDto[];
  voucher: VoucherDto;

  sim_nao: any[] = [
    {tipo: 'Sim', flag: 'S'},
    {tipo: 'Não', flag: 'N'}
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
              private voucherService: VoucherService,
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

  deletar(voucher: VoucherDto) {
    this.chamaCaixaDialogo(voucher);
  }

  chamaCaixaDialogo(voucher: VoucherDto) {
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
        this.voucherService.excluir(voucher.idVoucher).subscribe(() => {
          this.consultar();
          this.toastService.showSucesso("Vouchar excluído com sucesso.");
        }).add( () => this.loadingPopupService.closeDialog()  );
      } else {
        dialogRef.close();
      }
    });
  }

  atualizar(voucher: VoucherDto) {
    this.showDialog(voucher);
  }

  gerarVouchers() {
    this.showDialog(null);
  }

  showDialog(voucher: VoucherDto) {
    let idVoucher = null;

    if(voucher) {
      idVoucher = voucher.idVoucher;
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      idVoucher: idVoucher,
      perfilAcesso: this.perfilAcesso,
    };
    dialogConfig.panelClass = 'configuracaoDialogVoucher';
    
    const dialogRef = this.dialog.open(VoucherDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        this.consultar();
      } else {
        dialogRef.close();
      }
    });
  }

  consultar() {
    this.voucherService.getFilter(this.filtro.codigo,
                                  this.filtro.ativo,
                                  this.filtro.utilizado,
                                  this.filtro.dataInicioGerado,
                                  this.filtro.dataFimGerado)
      .subscribe((vouchers: VoucherDto[]) => {
      this.vouchers = vouchers;
      
      this.dataSource.data = vouchers ? vouchers : [];
      this.verificaMostrarTabela(vouchers);

      this.selection.clear();
      //this.dataSource.data.forEach(row => this.selection.select(row));
    })
  }

  verificaMostrarTabela(lista: VoucherDto[]) {
    if (!lista || lista.length == 0) {
      this.mostrarTabela = false;
      this.msg = "Nenhuma voucher encontrado."
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
    this.vouchers = [];
    this.dataSource.data = [];
    this.selection.clear();
  }


  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }


  exportar() {
    if(this.selection.selected && this.selection.selected.length === 0) {
      this.toastService.showAlerta('Selecione pelo menos um voucher que deseja exportar.');
      return;
    }

    const vouchers = this.selection.selected;
    this.chamaCaixaDialogoExportar(vouchers);    
  }

  chamaCaixaDialogoExportar(vouchers: VoucherDto[]) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: `Certeza que deseja exportar ?`,
      textoConfirma: 'SIM',
      textoCancela: 'NÃO'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        this.loadingPopupService.mostrarMensagemDialog('Gerando arquivo, aguarde...');
        this.voucherService.exportar(vouchers)
        .subscribe((dados: any) => {
          this.fileUtils.downloadFileXLS(dados, "vouchers.xlsx");
          this.toastService.showSucesso('Dados exportados com sucesso!');
          this.loadingPopupService.closeDialog();
        }, 
        (error) => {
          this.loadingPopupService.closeDialog();
        })        
      } else {
        dialogRef.close();
      }
    });
  }


  habilitarExclusaoEmLote() {
    return this.selection.selected && this.selection.selected.length > 0;
  }

  excluirEmLote() {
    if(this.selection.selected && this.selection.selected.length === 0) {
      this.toastService.showAlerta('Selecione pelo menos um voucher.');
      return;
    }
    
    const vouchers = this.selection.selected;

    const utilizados = vouchers.filter(elm => elm.utilizado);
    if(!_.isEmpty(utilizados)) {
      this.toastService.showAlerta('Nâo é possível excluir voucher já utilizados..');
      return;
    }
    
    const ids: number[] = vouchers.map(elm => elm.idVoucher);
    this.chamaCaixaDialogoExclusaoEmLote(ids);      
  }



  chamaCaixaDialogoExclusaoEmLote(ids: number[]) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: `Certeza que deseja exportar ?`,
      textoConfirma: 'SIM',
      textoCancela: 'NÃO'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        this.loadingPopupService.aguardeObservable(
          this.voucherService.excluirEmLote(ids)
        ).subscribe(() => {
          this.consultar();
          this.toastService.showSucesso('Vouchers excluídos com sucesso.');
        }).add(() => {});
      } else {
        dialogRef.close();
      }
    });
  }

}
