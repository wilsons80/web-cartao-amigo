import { AuthGuard } from './guards/auth.guard';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { DateAdapter, MatOptionModule } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';


import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, UrlSerializer } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AcessoRestritoComponent } from './components/acesso-restrito/acesso-restrito.component';
import { AuthInterceptor } from './components/common/auth-interceptor/auth-interceptor';
import { ConfirmDialogComponent } from './components/common/confirm-dialog/confirm-dialog.component';
import { ExceptionHandlerModule } from './components/common/exception-handler/exception-handler.module';
import { HttpErrorToastComponent } from './components/common/http-error-toast/http-error-toast.component';
import { HttpMgmtModule } from './components/common/http-mgmt/http-mgmt.module';
import { LoadingPopupModule } from './components/common/loading-popup/loading-popup.module';
import { PaginaNaoEncontradaComponent } from './components/common/pagina-nao-encontrada/pagina-nao-encontrada.component';
import { LoginModule } from './components/login/login.module';
import { getPortuguesePaginatorIntl } from './portuguese-paginator-intl/portuguese-paginator-intl.component';
import { AcessoModuloResolver } from './guards/acesso-modulo.resolve';
import { DATE_FORMAT_PT_BR, ComonsDateAdapter } from './date-config/comons-date-adapter';
import { AppSettings } from './app.settings';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { VerticalMenuComponent } from './components/menu/vertical-menu/vertical-menu.component';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { HomeComponent } from './components/home/home.component';
import { SharedModule } from './shared/shared.module';
import { SessaoService } from './services/sessao/sessao.service';
import { TelaPrincipalComponent } from './components/home/tela-principal/tela-principal.component';
import { CriarContaAssociadoModule } from './components/criar-conta-associado/criar-conta-associado.module';
import { ValidarCarteirinhaModule } from './components/validar-carteirinha/validar-cartao.module';
import { FormularioAssociadoModule } from './components/common/formulario-associado/formulario-associado.module';
import { RedefinirSenhaModule } from './components/redefinir-senha/redefinir-senha.module';
import { RedefinirNovaSenhaModule } from './components/redefinir-nova-senha/redefinir-nova-senha.module';
import { ClinicasModule } from './components/clinicas/clinicas.module';
import { AssociadosModule } from './components/associados/associados.module';
import { PerfilDialogComponent } from './components/user-menu/perfil-dialog/perfil-dialog.component';
import { DadosPessoaisModule } from './components/common/dados-pessoais/dados-pessoais.module';
import { TipoEspecialidadeModule } from './components/tipo-especialidade/tipo-especialidade.module';
import { FormularioAutorizadorCorretorModule } from './components/common/formulario-autorizador-corretor/formulario-autorizador-corretor.module';
import { FullscreenModule } from './components/fullscreen/fullscreen.module';


registerLocaleData(localePt, 'pt-BR');
@NgModule({
  declarations: [
    AppComponent,
    HttpErrorToastComponent,
    PaginaNaoEncontradaComponent,
    ConfirmDialogComponent,
    AcessoRestritoComponent,

    HomeComponent,
    SidenavComponent,
    VerticalMenuComponent,
    UserMenuComponent,
    TelaPrincipalComponent,
    PerfilDialogComponent   
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    FullscreenModule,

    AppRoutingModule,
    MatToolbarModule,
    LoginModule,
    CriarContaAssociadoModule,
    HttpClientModule,
    RouterModule,
    ExceptionHandlerModule,
    HttpMgmtModule,
    LoadingPopupModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    ValidarCarteirinhaModule,
    FormularioAssociadoModule,
    RedefinirSenhaModule,
    RedefinirNovaSenhaModule,
    ClinicasModule,
    AssociadosModule,
    DadosPessoaisModule,
    TipoEspecialidadeModule,
    FormularioAutorizadorCorretorModule,
  ],
  providers: [
    AuthGuard, AcessoModuloResolver, AppSettings, SessaoService, ReactiveFormsModule, FormsModule,
    { provide: MatPaginatorIntl, useValue: getPortuguesePaginatorIntl() },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },

    { provide: LOCALE_ID, useValue: 'pt-BR' },    
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT_PT_BR },
    { provide: DateAdapter, useClass: ComonsDateAdapter },

    { provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true } },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
