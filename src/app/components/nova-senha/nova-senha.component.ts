import { TrocaSenha } from './../../core/troca-senha';
import { AutenticadorService } from './../../services/autenticador/autenticador.service';
import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogConfig} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { ToastService } from 'src/app/services/toast/toast.service';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';
import { Routes, Router } from '@angular/router';
import { LogoutService } from 'src/app/services/logout/logout.service';
import { MediaMatcher } from '@angular/cdk/layout';
@Component({
  selector: 'app-nova-senha',
  templateUrl: './nova-senha.component.html',
  styleUrls: ['./nova-senha.component.css']
})
export class NovaSenhaComponent implements OnInit {

  trocaSenha:TrocaSenha = new TrocaSenha();
  confirmacaoNovaSenha: String;
  hide = true;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    private toastService: ToastService,
    private dialog: MatDialog,
    private location: Location,
    private autenticadorService:AutenticadorService,
    private logoutService:LogoutService,
    private drc: ChangeDetectorRef,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
  ) { 
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);      

  }

  ngOnInit() {
  }

  chamaCaixaDialogo() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      pergunta: 'Ao trocar a senha você terá que realizar o login novamente.',
      textoAuxiliar: 'Deseja continuar?',
      textoConfirma: 'SIM',
      textoCancela: 'NÃO'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(confirma => {
      if (confirma) {
        this.autenticadorService.trocarSenha(this.trocaSenha).subscribe(() =>{
          this.logoutService.logout();
        })
      } else {
        dialogRef.close();
      }
    }
    );
  }

  alterarSenha() {
    if (this.trocaSenha.senhaNova !== this.confirmacaoNovaSenha) {
      this.toastService.showAlerta("As novas senhas são diferentes.");
      return;
    }
    this.chamaCaixaDialogo();
  }

  cancelar() {
    this.location.back();
  }

  isNotMobile(): boolean {
    return !this.mobileQuery.matches;
  }

  getLogoCartaoAmigo() {
    return '../../../assets/imagens/LOGO_CARTAO_AMIGO-V2.2.jpg';
  }

}
