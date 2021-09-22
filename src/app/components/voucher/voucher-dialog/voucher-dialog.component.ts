import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Acesso } from 'src/app/core/acesso';
import { GrupoAcesso } from 'src/app/core/grupo-acesso';
import { PerfilAcesso } from 'src/app/core/perfil-acesso';
import { LoadingPopupService } from 'src/app/services/loadingPopup/loading-popup.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import * as _ from 'lodash';
import { PessoaFisica } from 'src/app/core/pessoa-fisica';
import { TipoUsuario } from 'src/app/core/tipo-usuario';
import { FuncoesUteisService } from 'src/app/services/commons/funcoes-uteis.service';
import { PerfilAcessoUsuario } from 'src/app/core/perfil-acesso-usuario';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { Voucher } from 'src/app/core/voucher';
import { VoucherService } from 'src/app/services/voucher/voucher.service';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { DataSimplesPipe } from 'src/app/pipes/data-simples.pipe';

@Component({
  selector: 'voucher-dialog',
  templateUrl: './voucher-dialog.component.html',
  styleUrls: ['./voucher-dialog.component.css'],
  providers: [DataSimplesPipe]
  
})
export class VoucherDialogComponent implements OnInit {

  @ViewChild('formulario') formulario;

  hide = true;
  isAtualizar = false;

  quantidade = 0;

  minDate = new Date();
  
  idVoucher: number;
  voucher: Voucher;
  vouchers: Voucher[] = [];
  perfilAcessos: PerfilAcesso[];
  perfilAcesso: Acesso;

  constructor(private dataUtilService: DataUtilService,
              public voucherService: VoucherService,
              private drc: ChangeDetectorRef,
              private loadingPopupService: LoadingPopupService,
              private toastService: ToastService,
              private dialog: MatDialog,
              private dataSimplesPipe: DataSimplesPipe,
              private funcoesUteisService: FuncoesUteisService,
              private dialogRef: MatDialogRef<VoucherDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data) {

      this.idVoucher = data.idVoucher;
      this.perfilAcesso = data.perfilAcesso;
      
  }

  ngOnInit() {
    this.init();

    if(this.idVoucher) {
      this.isAtualizar = true;
      this.loadingPopupService.mostrarMensagemDialog('Buscando, aguarde....');
      this.voucherService.getById(this.idVoucher).subscribe((voucher: Voucher) => {
        this.voucher = voucher;
      }).add( () => this.loadingPopupService.closeDialog()  )
    }

  }


  init(){
    this.voucher = new Voucher();
  }

  ngAfterContentChecked(): void {
    this.drc.detectChanges();
  }

  salvar() {
    this.validarPorcentagem();
    
    if(this.voucher.id) {
      this.atualizar();
    }else {
      this.cadastrar();
    }
  }

  gerarVoucher() {
    this.vouchers = [];
    for (var i=0; i<this.quantidade; i++) {
      const voucher        = new Voucher();
      voucher.descricao    = this.voucher.descricao;
      voucher.dataValidade = this.voucher.dataValidade;
      voucher.porcentagem  = this.voucher.porcentagem;
      this.vouchers.push(voucher);
    }

    const textoAuxiliar = [];
    textoAuxiliar.push('Quantidade:  ' + this.vouchers.length);
    textoAuxiliar.push('Validade: ' + this.dataSimplesPipe.transform(this.voucher.dataValidade));
    textoAuxiliar.push('Porcentagem: ' + this.voucher.porcentagem);
     

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: 'Confirma a criação dos vouchers ?',
      textoAuxiliar: textoAuxiliar,
      textoConfirma: 'SIM',
      textoCancela: 'NÃO'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        this.loadingPopupService.mostrarMensagemDialog('Processando, aguarde...');

        this.voucherService.salvarLista(this.vouchers).subscribe((vouchers: Voucher[]) => {
          this.vouchers = vouchers;
          this.toastService.showSucesso('Operação realizada com sucesso.');
          this.dialogRef.close(true);
        },
        (error) => {      
        }).add( () => this.loadingPopupService.closeDialog()  );

      } else {
        dialogRef.close();
      }
    });
  }

  validarPorcentagem() {
    if(this.voucher.porcentagem > 75 && this.voucher.porcentagem < 100) {
      this.toastService.showAlerta('O valor da porcentagem não pode ser superior a 75%.');
      this.voucher.porcentagem = null;
    }
  }

  formatar(){
    this.voucher.dataValidade = this.voucher.dataValidade ? new Date(this.voucher.dataValidade) : null;
  }

  isPermiteEditar(): boolean {
    return this.perfilAcesso.altera || this.perfilAcesso.insere;
  }
  
  private cadastrar(){
    this.loadingPopupService.mostrarMensagemDialog('Processando, aguarde...');
    this.voucherService.salvarLista(this.vouchers).subscribe((vouchers: Voucher[]) => {
      this.vouchers = vouchers;
      this.formatar();
      this.dialogRef.close(true);
      this.toastService.showSucesso('Operação realizada com sucesso.')
    },
    (error) => {      
    }).add( () => this.loadingPopupService.closeDialog()  );
  }

  private atualizar(){
    this.loadingPopupService.mostrarMensagemDialog('Processando, aguarde...');
    this.voucherService.alterar(this.voucher).subscribe((voucher: Voucher) => {
      this.voucher = voucher;
      this.formatar();
      this.dialogRef.close(true);
      this.toastService.showSucesso('Operação realizada com sucesso.')
    },
    (error) => {      
    }).add( () => this.loadingPopupService.closeDialog()  );
  }

  cancelar() {
    this.dialogRef.close(false);
  }

  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }

}