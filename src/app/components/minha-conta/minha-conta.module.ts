import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MinhaContaRoutingModule } from './minha-conta-routing.module';
import { MinhaContaComponent } from './minha-conta.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComboPesquisavelModule } from '../common/combo-pesquisavel/combo-pesquisavel.module';
import { FormularioTitularModule } from '../common/formulario-titular/formulario-titular.module';
import { FormularioDependenteModule } from '../common/formulario-dependente/formulario-dependente.module';
import { FormularioHistoricoPagamentoModule } from '../common/formulario-historico-pagamento/formulario-historico-pagamento.module';
import { RenovarAssinaturaModule } from '../common/renovar-assinatura/renovar-assinatura.module';
import { FormularioConsultasRealizadasModule } from '../common/formulario-consultas-realizadas/formulario-consultas-realizadas.module';
import { FormularioCarteirasModule } from '../common/formulario-carteiras/formulario-carteiras.module';


@NgModule({
  declarations: [MinhaContaComponent],
  imports: [
    CommonModule,
    CommonModule,
    FormsModule,
    RouterModule,
    SharedModule,    
    ComboPesquisavelModule,
    MinhaContaRoutingModule,
    FormularioTitularModule,
    FormularioDependenteModule,
    FormularioHistoricoPagamentoModule,
    RenovarAssinaturaModule,
    FormularioConsultasRealizadasModule,
    FormularioCarteirasModule
  ]
})
export class MinhaContaModule { }
