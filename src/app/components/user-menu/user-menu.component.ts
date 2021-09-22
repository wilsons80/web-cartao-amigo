import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UsuarioSistema } from 'src/app/core/usuario-sistema';
import { LoadingPopupService } from 'src/app/services/loadingPopup/loading-popup.service';
import { LogoutService } from 'src/app/services/logout/logout.service';
import { SessaoService } from 'src/app/services/sessao/sessao.service';
import { UsuarioSistemaService } from 'src/app/services/usuario-sistema/usuario-sistema.service';
import { PerfilDialogComponent } from './perfil-dialog/perfil-dialog.component';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserMenuComponent implements OnInit {

  public userImage = "../../../assets/img/no-profile.jpg";
  mostrarMenu = false;

  constructor(private logoutService: LogoutService,
              private dialog: MatDialog,
              private loadingPopupService: LoadingPopupService,
              public usuarioSistemaService: UsuarioSistemaService, 
              public sessaoService: SessaoService) { }

  ngOnInit() {
  }

  logout() {
    this.mostrarMenu = false;
    this.logoutService.logout();
  }

  naoPossuiFoto() {
    return "data:image/jpg;base64," === this.sessaoService.logo;
  }


  showDialogEditarPerfil() {
    this.loadingPopupService.mostrarMensagemDialog('Aguarde....');
    this.usuarioSistemaService.getById(this.sessaoService.idUsuario)
    .subscribe((usuarioLogado: UsuarioSistema) => {

      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        usuarioLogado: usuarioLogado,
      };
      dialogConfig.panelClass = 'configuracaoDialogUsuarioSistema';
      const dialogRef = this.dialog.open(PerfilDialogComponent, dialogConfig);
  
      dialogRef.afterClosed().subscribe(confirma => {
        if (confirma) {
          // fazer qualquer coisa
        } else {
          dialogRef.close();
        }
      });

    }).add(() => this.loadingPopupService.closeDialog() );


  }


}
