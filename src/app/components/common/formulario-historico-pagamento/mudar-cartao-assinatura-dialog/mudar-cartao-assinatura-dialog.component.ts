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
import { Assinaturas } from 'src/app/core/assinaturas';
import { AssinaturaPlanoRecorrenciaPagarmeService, NovaAssinaturaPlano } from 'src/app/services/pagarme/recorrencia/assinatura-plano-recorrencia-pagarme.service';
import { EditarCartaoAssinaturaPagarme } from 'src/app/services/pagarme/editar-cartao-assinatura-pagarme';


@Component({
  selector: 'mudar-cartao-assinatura-dialog',
  templateUrl: './mudar-cartao-assinatura-dialog.component.html',
  styleUrls: ['./mudar-cartao-assinatura-dialog.component.css'],
})
export class MudarCartaoAssinaturaDialogComponent implements OnInit {

  public maskCNPJ    = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  public maskPhone   = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public maskCelular = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public mascaraCpf  = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/,];
  public maskCartao  = [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/,/\d/, ' ', /\d/, /\d/, /\d/, /\d/]; 
  
  servicoCartao$: any;
  
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  cartoes: CartaoClientePagarme[];
  assinaturaAtiva: Assinaturas;
  perfilAcesso: Acesso;
  idTitular: number;

  cartaoEscolhido: CartaoClientePagarme;
  titulo = "Mudar cartão assinatura";

  constructor(
              private funcoesUteisService: FuncoesUteisService,
              private loadingPopupService: LoadingPopupService,
              private toastService: ToastService,
              changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              private assinaturaPlanoRecorrenciaPagarmeService: AssinaturaPlanoRecorrenciaPagarmeService,
              private cartaoClienteRecorrenciaPagarmeService: CartaoClienteRecorrenciaPagarmeService,
              private dialogRef: MatDialogRef<MudarCartaoAssinaturaDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data) {
      
      this.assinaturaAtiva  = data.assinaturaAtiva;
      this.cartoes          = data.cartoes;
      this.perfilAcesso     = data.perfilAcesso;
      this.idTitular        = data.idTitular;

      this.mobileQuery = media.matchMedia('(min-width: 768px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener); 
  }

  ngOnInit() {
  }

  ngAfterContentChecked(): void {
  }


  isPermiteEditar(): boolean {
    return this.perfilAcesso.altera || this.perfilAcesso.insere;
  }

  salvar() {
    const parans = new EditarCartaoAssinaturaPagarme();
    parans.card_id            = this.cartaoEscolhido.id;
    parans.idTitular          = this.idTitular;

    this.loadingPopupService.mostrarMensagemDialog('Processando, aguarde....');
    this.assinaturaPlanoRecorrenciaPagarmeService.editarCartaoAssinatura(this.assinaturaAtiva.codigoAssinatura, parans)
    .subscribe((assinaturaPlano: any) =>{
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


  getDescricaoCartao(cartao: CartaoClientePagarme){
    if(!!cartao){
      return `${this.getNumeroCartao(cartao)} Status: ${this.getStatusCartao(cartao.status)}`;
    }
  }

  getNumeroCartao(cartao: CartaoClientePagarme){
    if(!!cartao){
      const primeiros6digitos    = cartao.first_six_digits;
      const ultimos4digitos      = cartao.last_four_digits;
      return `${primeiros6digitos} **** ${ultimos4digitos}`;
    }
  }

  getDescExpiradoAndStatus(cartao: CartaoClientePagarme){
    if(!!cartao){
      return `${this.expira(cartao)} ${this.getStatusCartao(cartao.status)}`;
    }
  }

  private getStatusCartao(status: string){
    return status === 'active' ? 'Ativo' : (status === 'deleted' ? 'Deletado' : 'Expirado');
  } 

  private expira(cartao: CartaoClientePagarme){
    if(cartao.expirado){
      return `Expirado em ${cartao.exp_month}/${cartao.exp_year}`;
    }
    return `Expira em ${cartao.exp_month}/${cartao.exp_year}`;
  }

  isCartaoAtivo(cartao: CartaoClientePagarme) {
    return !!cartao && cartao.status === 'active';
  }
}