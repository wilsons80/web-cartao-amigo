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
import { DadosCartaoModule } from '../dados-cartao/dados-cartao.module';
import { RenovarAssinaturaComponent } from './renovar-assinatura.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [RenovarAssinaturaComponent],
  exports:[RenovarAssinaturaComponent],
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
    CadastroEnderecoModule,
    DadosCartaoModule,
    MatIconModule,
    MatInputModule,
    FlexLayoutModule,
    MatSidenavModule,
    TextMaskModule,
    MatStepperModule,
    MatOptionModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule
  ]
})
export class RenovarAssinaturaModule { }
