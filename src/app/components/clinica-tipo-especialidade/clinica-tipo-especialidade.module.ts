import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClinicaTipoEspecialidadeRoutingModule } from './clinica-tipo-especialidade-routing.module';
import { ClinicaTipoEspecialidadeComponent } from './clinica-tipo-especialidade.component';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComboPesquisavelOutlineModule } from '../common/combo-pesquisavel-outline/combo-pesquisavel-outline.module';


@NgModule({
  declarations: [ClinicaTipoEspecialidadeComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedModule,    
    ComboPesquisavelOutlineModule,
    ClinicaTipoEspecialidadeRoutingModule,
  ]
})
export class ClinicaTipoEspecialidadeModule { }
