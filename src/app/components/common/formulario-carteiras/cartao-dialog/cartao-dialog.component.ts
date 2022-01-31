import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadingPopupService } from 'src/app/services/loadingPopup/loading-popup.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import * as _ from 'lodash';
import { Acesso } from 'src/app/core/acesso';
import { MediaMatcher } from '@angular/cdk/layout';
import { FuncoesUteisService } from 'src/app/services/commons/funcoes-uteis.service';
import { CriarCartaoCliente } from 'src/app/services/pagarme/criar-cartao-cliente';
import { CartaoClienteRecorrenciaPagarmeService } from 'src/app/services/pagarme/recorrencia/cartao-cliente-recorrencia-pagarme.service';
import { Titular } from 'src/app/core/titular';
import { EnderecoCobrancaCartaoClientePagarme } from 'src/app/services/pagarme/endereco-cobranca-cartao-cliente-Pagarme';
import { ClientePagarme } from 'src/app/services/pagarme/cliente-pagarme';
import { CartaoClientePagarme } from 'src/app/services/pagarme/cartao-cliente-pagarme';


@Component({
  selector: 'cartao-dialog',
  templateUrl: './cartao-dialog.component.html',
  styleUrls: ['./cartao-dialog.component.css'],
})
export class CartaoDialogComponent implements OnInit {

  public maskCNPJ    = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  public maskPhone   = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public maskCelular = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public mascaraCpf  = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/,];
  public maskCartao  = [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/,/\d/, ' ', /\d/, /\d/, /\d/, /\d/]; 
  
  meses = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  perfilAcesso: Acesso = new Acesso(); 
  servicoCartao$: any;
  cartoes: CartaoClientePagarme[];

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  titular: Titular;
  cartao: CriarCartaoCliente;
  titulo = "Adicionar um novo cartão";

  constructor(
              private funcoesUteisService: FuncoesUteisService,
              private loadingPopupService: LoadingPopupService,
              private toastService: ToastService,
              changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              private cartaoClienteRecorrenciaPagarmeService: CartaoClienteRecorrenciaPagarmeService,
              private dialogRef: MatDialogRef<CartaoDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data) {

      this.perfilAcesso = data.perfilAcesso;
      this.cartao       = data.cartao;
      this.titular      = data.titular;

      this.mobileQuery = media.matchMedia('(min-width: 768px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener); 
  }

  ngOnInit() {
    if(!!this.cartao.id){
      this.titulo = 'Dados do seu cartão';
    } else {
      this.titulo = 'Adicionar um novo cartão';
    }
  }

  ngAfterContentChecked(): void {
  }


  isPermiteEditar(): boolean {
    return this.perfilAcesso.altera || this.perfilAcesso.insere;
  }

  salvar() {
    this.salvarCartao();
  }

  private salvarCartao(){
    const enderecoCobranca = new EnderecoCobrancaCartaoClientePagarme();
    enderecoCobranca.line_1     = this.titular.pessoaFisica.endereco;

    enderecoCobranca.line_2     = '';
    if(!!this.titular.pessoaFisica?.numeroEndereco){
      enderecoCobranca.line_2     += this.titular.pessoaFisica?.numeroEndereco + ' ';
    }
    if(!!this.titular.pessoaFisica?.complemento){
      enderecoCobranca.line_2     += this.titular.pessoaFisica?.complemento;
    }

	  enderecoCobranca.zip_code   = this.funcoesUteisService.getApenasNumeros(this.titular?.pessoaFisica?.cep);
	  enderecoCobranca.city       = this.titular.pessoaFisica.bairro;
	  enderecoCobranca.state      = this.titular.pessoaFisica.uf; // DF
	  enderecoCobranca.country    = 'BR';
    this.cartao.billing_address = enderecoCobranca;

    if(!this.cartao.customer){
      this.cartao.customer = new ClientePagarme();
    }
    this.cartao.customer.id = this.titular.idClientePagarMe;
    this.cartao.number      = this.funcoesUteisService.getApenasNumeros(this.cartao.number);
    this.cartao.idTitular   = this.titular.id;

    if(!!this.cartao.id) {
      this.servicoCartao$ = this.cartaoClienteRecorrenciaPagarmeService.editarCartao(this.cartao);
    } else {
      this.servicoCartao$ = this.cartaoClienteRecorrenciaPagarmeService.criarCartao(this.cartao);
    }

    this.loadingPopupService.mostrarMensagemDialog('Processando, aguarde....');
    this.servicoCartao$.subscribe((novoCartao) => {
      if(_.isEmpty(this.cartoes)){
        this.cartoes = [];
      }

      this.cartoes.push(novoCartao);
      this.toastService.showSucesso('Cartão salvo com sucesso.');
      this.dialogRef.close(true);
    }).add( () => this.loadingPopupService.closeDialog()  );
  }

  cancelar() {
    this.dialogRef.close(false);
  }

  
  isMobile(): boolean {
    return !this.mobileQuery.matches;
  }

  getImagemCVV() {
    return '../../../assets/imagens/cvv.png';
  }

  getLabelBotao(){
    return !!this.cartao.id ? 'Editar' : 'Adicionar';
  }
}