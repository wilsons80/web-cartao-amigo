import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Acesso } from 'src/app/core/acesso';
import { GrupoAcesso } from 'src/app/core/grupo-acesso';
import { PerfilAcesso } from 'src/app/core/perfil-acesso';
import { LoadingPopupService } from 'src/app/services/loadingPopup/loading-popup.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import * as _ from 'lodash';
import { UsuarioSistema } from 'src/app/core/usuario-sistema';
import { UsuarioSistemaService } from 'src/app/services/usuario-sistema/usuario-sistema.service';
import { PessoaFisica } from 'src/app/core/pessoa-fisica';
import { TipoUsuario } from 'src/app/core/tipo-usuario';
import { FuncoesUteisService } from 'src/app/services/commons/funcoes-uteis.service';
import { PerfilAcessoUsuario } from 'src/app/core/perfil-acesso-usuario';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { AutenticadorService } from 'src/app/services/autenticador/autenticador.service';
import { UsuarioLogado } from 'src/app/core/usuario-logado';
import { TiposUsuariosSistema } from 'src/app/core/tipos-usuarios-sistema';
import { SessaoService } from 'src/app/services/sessao/sessao.service';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ClinicaCombo } from 'src/app/core/clinica-combo';

@Component({
  selector: 'usuario-dialog',
  templateUrl: './usuario-dialog.component.html',
  styleUrls: ['./usuario-dialog.component.css'],
  
})
export class UsuarioDialogComponent implements OnInit {

  @ViewChild('formulario') formulario;

  hide = true;
  isAtualizar = false;

  minDate = new Date();
  usuarioLogado: UsuarioLogado;
  
  idUsuarioSistema: number;
  usuarioSistema: UsuarioSistema;
  perfilAcessos: PerfilAcesso[];
  perfilAcesso: Acesso;

  grupoAcessoAdministrativo: GrupoAcesso[];
  tiposUsuariosSistema: TiposUsuariosSistema;

  constructor(private dataUtilService: DataUtilService,
              public usuarioSistemaService: UsuarioSistemaService,
              private drc: ChangeDetectorRef,
              private dialog: MatDialog,
              private loadingPopupService: LoadingPopupService,
              public autenticadorService: AutenticadorService,
              private toastService: ToastService,
              private funcoesUteisService: FuncoesUteisService,
              private dialogRef: MatDialogRef<UsuarioDialogComponent>,
              private sessaoService: SessaoService,
              @Inject(MAT_DIALOG_DATA) data) {

      this.idUsuarioSistema          = data.idUsuarioSistema;
      this.perfilAcesso              = data.perfilAcesso;
      this.grupoAcessoAdministrativo = data.grupoAcessoAdministrativo;
      this.usuarioLogado             = data.usuarioLogado;
  }

  ngOnInit() {
    this.init();

    if(this.idUsuarioSistema) {
      this.isAtualizar = true;

      this.loadingPopupService.mostrarMensagemDialog('Buscando, aguarde....');
      this.usuarioSistemaService.getById(this.idUsuarioSistema).subscribe((usuarioSistema: UsuarioSistema) => {
        this.usuarioSistema = usuarioSistema;

        this.usuarioSistema.dataUltimoAcesso  = this.usuarioSistema.dataUltimoAcesso    ? new Date(this.usuarioSistema.dataUltimoAcesso) : null;
        this.usuarioSistema.pessoaFisica.dataNascimento = this.usuarioSistema.pessoaFisica.dataNascimento ? new Date(this.usuarioSistema.pessoaFisica.dataNascimento) : null;

        this.usuarioSistema.pessoaFisica.cpf  = this.funcoesUteisService.getApenasNumeros(this.usuarioSistema.pessoaFisica.cpf)

      }).add( () => this.loadingPopupService.closeDialog()  )
    }

  }


  init(){
    this.usuarioSistema = new UsuarioSistema();
    this.usuarioSistema.pessoaFisica = new PessoaFisica();
    this.usuarioSistema.tipoUsuario = new TipoUsuario();

    this.tiposUsuariosSistema = new TiposUsuariosSistema();
    if(this.sessaoService.usuarioLogado.tipoUsuario.id !== 5) {//root
      this.tiposUsuariosSistema.tipos = this.tiposUsuariosSistema.tipos.filter(t => t.id != 5);
    }
  }

  ngAfterContentChecked(): void {
    this.drc.detectChanges();
  }

  salvar() {
    this.formatar();
    
    if(this.usuarioSistema.id) {
      this.atualizar();
    }else {
      this.cadastrar();
    }
  }

  formatar() {
    this.usuarioSistema.pessoaFisica.cep = this.funcoesUteisService.getApenasNumeros(this.usuarioSistema?.pessoaFisica?.cep);
    this.usuarioSistema.pessoaFisica.cpf = this.usuarioSistema.pessoaFisica.cpf ? this.funcoesUteisService.getApenasNumeros(this.usuarioSistema.pessoaFisica.cpf.toString()) : null

    this.usuarioSistema.dataUltimoAcesso            = this.usuarioSistema.dataUltimoAcesso    ? new Date(this.usuarioSistema.dataUltimoAcesso) : null;
    this.usuarioSistema.pessoaFisica.dataNascimento = this.usuarioSistema.pessoaFisica.dataNascimento ? new Date(this.usuarioSistema.pessoaFisica.dataNascimento) : null;
    this.usuarioSistema.pessoaFisica.cpf            = this.funcoesUteisService.getApenasNumeros(this.usuarioSistema.pessoaFisica.cpf)

  }

  private cadastrar(){
    this.loadingPopupService.mostrarMensagemDialog('Processando, aguarde...');
    this.usuarioSistemaService.cadastrar(this.usuarioSistema).subscribe(
    (usuarioSistema: UsuarioSistema) => {
      this.usuarioSistema = usuarioSistema;
      this.formatar();
      this.dialogRef.close(true);
      this.toastService.showSucesso('Operação realizada com sucesso.')
    },
    (error) => {
      
    }).add( () => this.loadingPopupService.closeDialog()  );
  }

  private atualizar(){
    this.loadingPopupService.mostrarMensagemDialog('Processando, aguarde...');
    this.usuarioSistemaService.alterar(this.usuarioSistema).subscribe(
    (usuarioSistema: UsuarioSistema) => {
      this.usuarioSistema = usuarioSistema;
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

  onCarregarTipoUsuairo(evento) {
    if(evento.value) {
      if(this.usuarioSistema.gruposAcesso?.length > 0){
        this.chamaCaixaDialogoChangePermissaoSistema(evento.value);
      } else {
        this.usuarioSistema.tipoUsuario = _.cloneDeep(_.find(this.tiposUsuariosSistema.tipos,  (tipo) => tipo.id === evento.value));
      }
    } else {
      this.usuarioSistema.tipoUsuario = new TipoUsuario();
    }
  }

  chamaCaixaDialogoChangePermissaoSistema(idTipoUsuario) {
    const textoAuxiliar = [];
    textoAuxiliar.push('Essa mudança apagará todas as permissões do sistema existentes.');
    textoAuxiliar.push('Ao clicar em SIM, será necessário atribuir novas permissões.');

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: 'Deseja continuar ?',
      textoAuxiliar: textoAuxiliar,
      textoConfirma: 'SIM',
      textoCancela: 'NÃO'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        this.usuarioSistema.tipoUsuario = _.cloneDeep(_.find(this.tiposUsuariosSistema.tipos,  (tipo) => tipo.id === idTipoUsuario));
        this.usuarioSistema.gruposAcesso = [];        
      } else {
        this.usuarioSistema.tipoUsuario = _.cloneDeep(_.find(this.tiposUsuariosSistema.tipos,  (tipo) => tipo.descricao.toUpperCase() === this.usuarioSistema.tipoUsuario.descricao.toUpperCase()));
        dialogRef.close();
      }
    });
  }


  addGrupoAcesso() {
    
    if (!this.usuarioSistema.gruposAcesso) {
      this.usuarioSistema.gruposAcesso = [];
    }

    const grupo:any = new PerfilAcessoUsuario();

    grupo.id = undefined;
    grupo.usuario = new UsuarioSistema();
    grupo.grupoAcesso = new GrupoAcesso();
    grupo.grupoAcesso.perfilAcesso = new PerfilAcesso();
    grupo.grupoAcesso.gruposAcessoModulos = [];
    
    this.usuarioSistema.gruposAcesso.push(grupo);
  }


  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }


  isTipoUsuarioClinica(): boolean {
    if(this.usuarioSistema.tipoUsuario?.id) {
      const isUsuarioTipoClinica = this.tiposUsuariosSistema.isUsuarioTipoClinica(this.usuarioSistema.tipoUsuario.id);
      return isUsuarioTipoClinica;
    }
    return false;
  }

  isShowPermissaoSistema() {
    const tipoUsuarioLogado = this.usuarioLogado?.tipoUsuario;
    const isTipoAdministrativo = this.tiposUsuariosSistema.isUsuarioTipoAdministrativo(tipoUsuarioLogado?.id);
    const isTipoRoot           = this.tiposUsuariosSistema.isUsuarioTipoRoot(tipoUsuarioLogado?.id);

    return isTipoAdministrativo || isTipoRoot;
  }
}