import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImpressaoCartaoRoutingModule } from './impressao-cartao-routing.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComboPesquisavelModule } from '../common/combo-pesquisavel/combo-pesquisavel.module';
import { ImpressaoCartaoComponent } from './impressao-cartao.component';


@NgModule({
  declarations: [ImpressaoCartaoComponent],
  imports: [
    FormsModule,
    RouterModule,
    SharedModule,    
    ComboPesquisavelModule,
    ImpressaoCartaoRoutingModule
  ]
})
export class ImpressaoCartaoModule { }
