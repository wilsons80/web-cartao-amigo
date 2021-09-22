import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Modulos } from 'src/app/core/modulos';
import { AcessoModuloResolver } from 'src/app/guards/acesso-modulo.resolve';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { ImpressaoCartaoComponent } from './impressao-cartao.component';

const routes: Routes = [
  {path: '', component: ImpressaoCartaoComponent, pathMatch: 'full', canActivate: [AuthGuard], resolve: {perfilAcesso:AcessoModuloResolver}, data:{modulo:Modulos.IMPRESSAO_CARTAO} }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImpressaoCartaoRoutingModule { }
