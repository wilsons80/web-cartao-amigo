import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Acesso } from 'src/app/core/acesso';
import { PerfilAcesso } from 'src/app/core/perfil-acesso';
import { LoadingPopupService } from 'src/app/services/loadingPopup/loading-popup.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import * as _ from 'lodash';
import { PessoaFisica } from 'src/app/core/pessoa-fisica';
import { FuncoesUteisService } from 'src/app/services/commons/funcoes-uteis.service';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { Associados } from 'src/app/core/associados';
import { TitularService } from 'src/app/services/titular/titular.service';
import { Titular } from 'src/app/core/titular';
import { switchMap, tap } from 'rxjs/operators';
import { HistoricoPagamentoService } from 'src/app/services/historico-pagamento/historico-pagamento.service';
import { HistoricoPagamento } from 'src/app/core/historico-pagamento';
import { HistoricoPagamentoBuilder } from 'src/app/services/builder/historico-pagamento-builder';

@Component({
  selector: 'associado-dialog',
  templateUrl: './associado-dialog.component.html',
  styleUrls: ['./associado-dialog.component.css'],
  
})
export class AssociadoDialogComponent implements OnInit {

  @ViewChild('formulario') formulario;

  maskCNPJ = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  maskPhone = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  maskCelular = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  mascaraCpf = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/,];

  hide = true;
  isAtualizar = false;

  minDate = new Date();
  
  associado: Associados;
  perfilAcessos: PerfilAcesso[];
  perfilAcesso: Acesso;

  titular: Titular;
  historicoPagamentos: HistoricoPagamento[];


  constructor(private dataUtilService: DataUtilService,
              public titularService: TitularService,
              private historicoPagamentoService: HistoricoPagamentoService,
              private drc: ChangeDetectorRef,
              private loadingPopupService: LoadingPopupService,
              private historicoPagamentoBuilder: HistoricoPagamentoBuilder,
              private toastService: ToastService,
              private funcoesUteisService: FuncoesUteisService,
              private dialogRef: MatDialogRef<AssociadoDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data) {
      this.perfilAcesso = data.perfilAcesso;
      this.associado = data.associado;
  }

  ngOnInit() {
    this.init();

    this.titular = new Titular();
    this.titular.pessoaFisica = new PessoaFisica();
    this.titular.dependentes = [];
    
    if(this.associado.idTitular) {
      this.isAtualizar = true;

      this.loadingPopupService.mostrarMensagemDialog('Buscando, aguarde....');
      this.titularService.getById(this.associado.idTitular).pipe(
        tap((titular: Titular) => {
          this.titular = titular;
          this.titular.pessoaFisica.cpf  = this.funcoesUteisService.getApenasNumeros(this.titular.pessoaFisica.cpf)
        }),
        switchMap((titular: Titular) => {
          return this.historicoPagamentoService.getPagamentoByTitular(titular.id);
        })
      ).subscribe((historicoPagamento: HistoricoPagamento[]) =>{
        this.historicoPagamentos = historicoPagamento;
        if(!_.isEmpty(this.historicoPagamentos)) {
          this.historicoPagamentos = this.historicoPagamentos.map(h => this.historicoPagamentoBuilder.build(h));
        }
      }).add( () => this.loadingPopupService.closeDialog()  );

    }

  }


  init(){
  }

  ngAfterContentChecked(): void {
    this.drc.detectChanges();
  }

  salvar() {
    this.formatar();
    this.atualizar();
  }

  formatar() {
    this.titular.pessoaFisica.cep     = this.funcoesUteisService.getApenasNumeros(this.titular?.pessoaFisica?.cep);
    this.titular.pessoaFisica.cpf     = this.titular.pessoaFisica.cpf ? this.funcoesUteisService.getApenasNumeros(this.titular.pessoaFisica.cpf.toString()) : null;
    this.titular.pessoaFisica.celular = this.titular.pessoaFisica.celular ? this.funcoesUteisService.getApenasNumeros(this.titular.pessoaFisica.celular.toString()) : null;

    if(!_.isEmpty(this.titular.dependentes) ){
      this.titular.dependentes.forEach(
        d => {
          d.pessoaFisica.cep     = d.pessoaFisica.cep ? this.funcoesUteisService.getApenasNumeros(d?.pessoaFisica?.cep) : '';
          d.pessoaFisica.celular = d.pessoaFisica.celular ? this.funcoesUteisService.getApenasNumeros(d?.pessoaFisica?.celular) : '';
          d.pessoaFisica.cpf     = d.pessoaFisica.cpf ? this.funcoesUteisService.getApenasNumeros(d.pessoaFisica.cpf.toString()) : null;
        }
      )
    }

  }

  isPermiteEditar(): boolean {
    return this.perfilAcesso.altera || this.perfilAcesso.insere;
  }


  private atualizar(){
    this.loadingPopupService.mostrarMensagemDialog('Processando, aguarde...');
    this.titularService.alterar(this.titular).subscribe((titular: Titular) => {
      this.titular = titular;
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