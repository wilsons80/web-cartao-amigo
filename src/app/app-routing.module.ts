import { AcessoRestritoComponent } from './components/acesso-restrito/acesso-restrito.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { NovaSenhaComponent } from './components/nova-senha/nova-senha.component';
import { HomeComponent } from './components/home/home.component';
import { TelaPrincipalComponent } from './components/home/tela-principal/tela-principal.component';
import { PaginaNaoEncontradaComponent } from './components/common/pagina-nao-encontrada/pagina-nao-encontrada.component';
import { CriarContaAssociadoComponent } from './components/criar-conta-associado/criar-conta-associado.component';
import { FormularioAssociadoComponent } from './components/common/formulario-associado/formulario-associado.component';
import { RedefinirSenhaComponent } from './components/redefinir-senha/redefinir-senha.component';
import { ValidarCartaoComponent } from './components/validar-carteirinha/validar-cartao.component';
import { RedefinirNovaSenhaComponent } from './components/redefinir-nova-senha/redefinir-nova-senha.component';
import { FormularioAutorizadorCorretorComponent } from './components/common/formulario-autorizador-corretor/formulario-autorizador-corretor.component';


const routes: Routes = [

  { 
    path: '', component: HomeComponent, canActivate: [AuthGuard], children: [
      { path: '', component: TelaPrincipalComponent },
      { path: 'configuracao/grupoacesso', loadChildren: () => import('./components/home/grupo-acesso/grupo-acesso.module').then(m => m.GrupoAcessoModule) },
      { path: 'configuracao/novasenha', loadChildren: () => import('./components/nova-senha/nova-senha.module').then(m => m.NovaSenhaModule)} ,
      { path: 'configuracao/usuarios', loadChildren: () => import('./components/usuarios/usuarios.module').then(m => m.UsuariosModule)} ,
      { path: 'administrativo/clinicas', loadChildren: () => import('./components/clinicas/clinicas.module').then(m => m.ClinicasModule)} ,
      { path: 'administrativo/associados', loadChildren: () => import('./components/associados/associados.module').then(m => m.AssociadosModule)} ,
      { path: 'administrativo/impressao-cartao', loadChildren: () => import('./components/impressao-cartao/impressao-cartao.module').then(m => m.ImpressaoCartaoModule)} ,
      { path: 'administrativo/voucher', loadChildren: () => import('./components/voucher/voucher.module').then(m => m.VoucherModule)} ,
      { path: 'administrativo/especialidades', loadChildren: () => import('./components/tipo-especialidade/tipo-especialidade.module').then(m => m.TipoEspecialidadeModule)} ,
      { path: 'administrativo/corretor', loadChildren: () => import('./components/corretor/corretor.module').then(m => m.CorretorModule)} ,

      { path: 'associado/minhaconta', loadChildren: () => import('./components/minha-conta/minha-conta.module').then(m => m.MinhaContaModule)} ,
      { path: 'associado/clinicaespecialidades', loadChildren: () => import('./components/clinica-tipo-especialidade/clinica-tipo-especialidade.module').then(m => m.ClinicaTipoEspecialidadeModule)} ,
    ]
  },
  
  { path: 'login', component: LoginComponent },
  { path: 'contaassociado', component: CriarContaAssociadoComponent }, // usado na tela de login do sistema
  
  { path: 'formulario-associado', component: FormularioAssociadoComponent }, // usado no site principal
  { path: 'pagamento/corretor', component: FormularioAssociadoComponent }, // usado para link de pagamento do corretor
  
  { path: 'pagseguro/split/redirect', component: FormularioAutorizadorCorretorComponent},
  { path: 'validarcartao', component: ValidarCartaoComponent},
  { path: 'VALIDARCARTAO', component: ValidarCartaoComponent},
  { path: 'clinicacredenciada', component: ValidarCartaoComponent},
  { path: 'redefinirsenha', component: RedefinirSenhaComponent },
  { path: 'redefinirnovasenha', component: RedefinirNovaSenhaComponent },
  { path: 'novasenha', component: NovaSenhaComponent, canActivate: [AuthGuard]},
  { path: 'acessorestrito', component: AcessoRestritoComponent, canActivate: [AuthGuard]},
  { path: '**', component: PaginaNaoEncontradaComponent }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules, // <- comment this line for activate lazy load
    relativeLinkResolution: 'legacy',
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
