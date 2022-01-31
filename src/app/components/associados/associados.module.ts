import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssociadosRoutingModule } from './associados-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComboPesquisavelModule } from '../common/combo-pesquisavel/combo-pesquisavel.module';
import { AssociadosComponent } from './associados.component';
import { SharedPipesModule } from 'src/app/pipes/shared-pipes.module';
import { AssociadoDialogComponent } from './associado-dialog/associado-dialog.component';
import { CadastroEnderecoModule } from '../common/cadastro-endereco/cadastro-endereco.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { BrowserModule } from '@angular/platform-browser';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';
import { FormularioTitularModule } from '../common/formulario-titular/formulario-titular.module';
import { FormularioDependenteModule } from '../common/formulario-dependente/formulario-dependente.module';
import { FormularioHistoricoPagamentoModule } from '../common/formulario-historico-pagamento/formulario-historico-pagamento.module';
import { FormularioConsultasRealizadasModule } from '../common/formulario-consultas-realizadas/formulario-consultas-realizadas.module';
import { FormularioCarteirasComponent } from '../common/formulario-carteiras/formulario-carteiras.component';
import { FormularioCarteirasModule } from '../common/formulario-carteiras/formulario-carteiras.module';

@NgModule({
  declarations: [AssociadosComponent, 
                 AssociadoDialogComponent],
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
    AssociadosRoutingModule,
    CadastroEnderecoModule,
    FormularioTitularModule,
    FormularioDependenteModule,
    FormularioHistoricoPagamentoModule,
    FormularioConsultasRealizadasModule,
    FormularioCarteirasModule
  ]
})
export class AssociadosModule { }
