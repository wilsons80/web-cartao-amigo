import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Modulos } from 'src/app/core/modulos';
import { AcessoModuloResolver } from 'src/app/guards/acesso-modulo.resolve';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { ClinicaTipoEspecialidadeComponent } from './clinica-tipo-especialidade.component';

const routes: Routes = [
  {path: '', component: ClinicaTipoEspecialidadeComponent, pathMatch: 'full', canActivate: [AuthGuard], resolve: {perfilAcesso:AcessoModuloResolver}, data:{modulo:Modulos.CLINICAS_ESPECIALIDADES} }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicaTipoEspecialidadeRoutingModule { }
