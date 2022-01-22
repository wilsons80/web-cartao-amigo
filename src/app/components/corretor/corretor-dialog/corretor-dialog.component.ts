import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadingPopupService } from 'src/app/services/loadingPopup/loading-popup.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import * as _ from 'lodash';
import { Acesso } from 'src/app/core/acesso';
import { Corretor } from 'src/app/core/corretor';
import { CorretorService } from 'src/app/services/corretor/corretor.service';
import { PessoaFisica } from 'src/app/core/pessoa-fisica';
import { FuncoesUteisService } from 'src/app/services/commons/funcoes-uteis.service';


@Component({
  selector: 'corretor-dialog',
  templateUrl: './corretor-dialog.component.html',
  styleUrls: ['./corretor-dialog.component.css'],
})
export class CorretorDialogComponent implements OnInit {

  public maskPhone = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public maskCelular = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public mascaraCpf  = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  
  idCorretor: number;
  corretor: Corretor;
  perfilAcesso: Acesso = new Acesso(); 

  isAtualizacao = false;

  constructor(private corretorService: CorretorService,
              private loadingPopupService: LoadingPopupService,
              private toastService: ToastService,
              private funcoesUteisService: FuncoesUteisService,
              private dialogRef: MatDialogRef<CorretorDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data) {
      this.idCorretor = data.idCorretor;
      this.perfilAcesso = data.perfilAcesso;
  }

  ngOnInit() {
    this.corretor = new Corretor();
    this.corretor.ativo = true;
    this.corretor.pessoaFisica = new PessoaFisica();
    this.isAtualizacao = false;

    if(this.idCorretor) {
      this.isAtualizacao = true;
      this.loadingPopupService.mostrarMensagemDialog('Buscando, aguarde...');
      this.corretorService.getById(this.idCorretor).subscribe((corretor: Corretor) => {
        this.corretor = corretor
      }).add( () => this.loadingPopupService.closeDialog()  );
    }
  }

  ngAfterContentChecked(): void {
  }

  
  isPermiteEditar(): boolean {
    return this.perfilAcesso.altera || this.perfilAcesso.insere;
  }
  
  validarPorcentagem() {
    if(this.corretor.valorRecebimento > 90) {
      this.toastService.showAlerta('O valor da porcentagem não pode ser superior a 90.');
      this.corretor.valorRecebimento = null;
    }
  }

  formatar() {
    this.corretor.pessoaFisica.cep = this.funcoesUteisService.getApenasNumeros(this.corretor?.pessoaFisica?.cep);
    this.corretor.pessoaFisica.celular = this.funcoesUteisService.getApenasNumeros(this.corretor?.pessoaFisica?.celular);
    this.corretor.pessoaFisica.cpf = this.corretor.pessoaFisica.cpf ? this.funcoesUteisService.getApenasNumeros(this.corretor.pessoaFisica.cpf.toString()) : null
  }

  salvar() {
    this.formatar();
    this.validarPorcentagem();
    this.corretor.isPorcentagem = true;

    if(this.corretor.id) {
      this.atualizar();
    }else {
      this.cadastrar();
    }
  }

  private cadastrar(){
    this.loadingPopupService.mostrarMensagemDialog('Processando, aguarde...');
    this.corretorService.cadastrar(this.corretor).subscribe((corretor: Corretor) => {
      this.corretor = corretor;
      this.isAtualizacao = true;
      this.dialogRef.close(true);
      this.toastService.showSucesso('Operação realizada com sucesso.');
    }).add( () => this.loadingPopupService.closeDialog()  );
  }

  private atualizar(){
    this.loadingPopupService.mostrarMensagemDialog('Processando, aguarde...');
    this.corretorService.alterar(this.corretor).subscribe((corretor: Corretor) => {
      this.corretor = corretor;
      this.isAtualizacao = true;
      this.dialogRef.close(true);
      this.toastService.showSucesso('Operação realizada com sucesso.');
    }).add( () => this.loadingPopupService.closeDialog()  );
  }

  cancelar() {
    this.dialogRef.close(false);
  }


  getCodigo() {
    return this.corretor?.codigo ? 'CÓDIGO: ' +  this.corretor.codigo : '';
  }
}