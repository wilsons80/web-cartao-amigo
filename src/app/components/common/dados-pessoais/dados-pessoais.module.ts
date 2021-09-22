import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DadosPessoaisComponent } from './dados-pessoais.component';
import { ComboPesquisavelModule } from '../combo-pesquisavel/combo-pesquisavel.module';
import { CadastroEnderecoModule } from '../cadastro-endereco/cadastro-endereco.module';
import { LoadingPopupModule } from '../loading-popup/loading-popup.module';


@NgModule({
  declarations: [DadosPessoaisComponent],
  exports:[DadosPessoaisComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    SharedModule,
    PipesModule,
    ComboPesquisavelModule,
    LoadingPopupModule,
    MatProgressSpinnerModule,
    SharedDirectivesModule,
    CadastroEnderecoModule,
    MatDatepickerModule,
  ]
})
export class DadosPessoaisModule { }
