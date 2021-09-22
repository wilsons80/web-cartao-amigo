import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CriarContaAssociadoComponent } from './criar-conta-associado.component';
import { CadastroEnderecoModule } from '../common/cadastro-endereco/cadastro-endereco.module';
import { TextMaskModule } from 'angular2-text-mask';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';
import { MatStepperModule } from '@angular/material/stepper';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormularioAssociadoModule } from '../common/formulario-associado/formulario-associado.module';


@NgModule({
  declarations: [CriarContaAssociadoComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
    FlexLayoutModule,
    MatButtonModule,
    RouterModule,
    MatSidenavModule,
    SharedDirectivesModule,
    TextMaskModule,
    CadastroEnderecoModule,
    MatStepperModule,
    MatOptionModule,
    MatSelectModule,
    FormularioAssociadoModule
  ]
})
export class CriarContaAssociadoModule { }
