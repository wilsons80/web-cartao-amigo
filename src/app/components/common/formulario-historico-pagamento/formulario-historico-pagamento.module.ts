import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedPipesModule } from 'src/app/pipes/shared-pipes.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { BrowserModule } from '@angular/platform-browser';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';
import { ComboPesquisavelModule } from '../combo-pesquisavel/combo-pesquisavel.module';
import { CadastroEnderecoModule } from '../cadastro-endereco/cadastro-endereco.module';
import { FormularioHistoricoPagamentoComponent } from './formulario-historico-pagamento.component';


@NgModule({
  declarations: [FormularioHistoricoPagamentoComponent],
  exports:[FormularioHistoricoPagamentoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,    
    SharedPipesModule,
    SharedDirectivesModule,
    PipesModule,
    MatTabsModule,
    MatExpansionModule,
    ComboPesquisavelModule,
    CadastroEnderecoModule
  ]
})
export class FormularioHistoricoPagamentoModule { }
