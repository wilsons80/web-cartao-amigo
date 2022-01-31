import { Component, OnInit, ChangeDetectorRef, Input, forwardRef, ViewChild, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { ControlContainer, NgForm, NgModelGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MediaMatcher } from '@angular/cdk/layout';
import { Titular } from 'src/app/core/titular';
import { CartaoClienteRecorrenciaPagarmeService } from 'src/app/services/pagarme/recorrencia/cartao-cliente-recorrencia-pagarme.service';
import { CartaoClientePagarme } from 'src/app/services/pagarme/cartao-cliente-pagarme';
import { Acesso } from 'src/app/core/acesso';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CriarCartaoCliente } from 'src/app/services/pagarme/criar-cartao-cliente';
import { ToastService } from 'src/app/services/toast/toast.service';
import { LoadingPopupService } from 'src/app/services/loadingPopup/loading-popup.service';
import { CartaoDialogComponent } from './cartao-dialog/cartao-dialog.component';

@Component({
  selector: 'formulario-carteiras',
  templateUrl: './formulario-carteiras.component.html',
  styleUrls: ['./formulario-carteiras.component.css'], 
  viewProviders:  [
    { provide:  ControlContainer, useExisting:  NgForm },
    { provide: ControlContainer, useExisting: forwardRef(() => NgModelGroup) }
  ] 
})
export class FormularioCarteirasComponent implements OnInit {

  @Input() titular: Titular;
  @Input() cartoes: CartaoClientePagarme[];
  @Input() perfilAcesso: Acesso;

  @ViewChild(MatSort) sort: MatSort;

  mobileQuery: MediaQueryList;
	private _mobileQueryListener: () => void;

  msg: string;
  step;


  constructor(private dataUtilService: DataUtilService,
              changeDetectorRef: ChangeDetectorRef,
              private cartaoClienteRecorrenciaPagarmeService: CartaoClienteRecorrenciaPagarmeService,
              media: MediaMatcher,
              private drc: ChangeDetectorRef,
              private toastService: ToastService,
              private loadingPopupService: LoadingPopupService,
              private dialog: MatDialog) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener); 
  }

  ngOnInit() {

  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  ngAfterContentChecked(): void {
    this.drc.detectChanges();
  }

  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }

  expira(cartao: CartaoClientePagarme){
    if(cartao.expirado) {
      return `Expirado em ${cartao.exp_month}/${cartao.exp_year}`;
    }
    return `Expira em ${cartao.exp_month}/${cartao.exp_year}`;
  }

  editar(cartaoEditar: CartaoClientePagarme) {
    const cartao = new CriarCartaoCliente();
    cartao.id              = cartaoEditar.id;
    cartao.first_six_digits= cartaoEditar.first_six_digits;
    cartao.last_four_digits= cartaoEditar.last_four_digits;
    cartao.holder_name     = cartaoEditar.holder_name;
    cartao.holder_document = cartaoEditar.holder_document;
    cartao.exp_month       = cartaoEditar.exp_month;
    cartao.exp_year        = cartaoEditar.exp_year;
    cartao.billing_address = cartaoEditar.billing_address; // EnderecoCobrancaCartaoClientePagarme;

    this.showDialogCartao(cartao);
  }

  remover(index: number, cartao: CartaoClientePagarme) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: 'Certeza que deseja excluir ?',
      textoConfirma: 'SIM',
      textoCancela: 'NÃO'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        this.cartoes.splice(index, 1);
        this.setStep(0);

        this.loadingPopupService.mostrarMensagemDialog('Processando, aguarde...');
        this.cartaoClienteRecorrenciaPagarmeService.excluirCartaoCliente(this.titular.idClientePagarMe, cartao.id)
        .subscribe((cartaoRemovido: CartaoClientePagarme) => {
          this.toastService.showSucesso(`O Cartao terminando com ${cartaoRemovido.last_four_digits} foi removido com sucesso.`);
        }).add( () => this.loadingPopupService.closeDialog()  );
      } else {
        dialogRef.close();
      }
    });
  }


  showDialogCartao(dadosCartao: CriarCartaoCliente) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      perfilAcesso: this.perfilAcesso,
      cartao: dadosCartao,
      titular: this.titular,
      cartoes: this.cartoes
    };
    dialogConfig.panelClass = 'configuracaoDialogCartao';

    const dialogRef = this.dialog.open(CartaoDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        this.loadingPopupService.mostrarMensagemDialog('Atualizando os cartões, um momento...');
        this.cartaoClienteRecorrenciaPagarmeService.listarCartoesCliente(this.titular.idClientePagarMe)
        .subscribe((cartoes: CartaoClientePagarme[]) => {
          this.cartoes = cartoes;
        }).add( () => this.loadingPopupService.closeDialog()  );
      } else {
        dialogRef.close();
      }
    });
  }

  adicionar() {
    if(_.isEmpty(this.cartoes) ) {
      this.cartoes = [];
    }

    const cartao = new CriarCartaoCliente();
    cartao.id              = null;
    cartao.number          = null;
    cartao.holder_name     = null;
    cartao.holder_document = null;
    cartao.exp_month       = null;
    cartao.exp_year        = null;
    cartao.cvv             = null;
    cartao.brand           = null;
    cartao.label           = null; // "Sua bandeira"
    cartao.status          = null;    
    cartao.billing_address = null; // EnderecoCobrancaCartaoClientePagarme;

    this.showDialogCartao(cartao);

    this.setStep(this.cartoes.length - 1);
  }



  isPermissaoApenasConsulta() {
    return this.perfilAcesso.consulta && !this.perfilAcesso.altera && !this.perfilAcesso.deleta && !this.perfilAcesso.insere;
  }

  isPermiteAdicionar() {
    if(_.isEmpty(this.cartoes)) {
      this.cartoes = [];
    }
    return !this.isPermissaoApenasConsulta();
  }

}