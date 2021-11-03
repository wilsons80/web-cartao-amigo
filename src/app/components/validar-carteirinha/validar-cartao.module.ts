import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValidarCartaoComponent } from './validar-cartao.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule } from '@angular/router';
import { TextMaskModule } from 'angular2-text-mask';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';
import { DialogValidarCartaoComponent } from './dialog-validar-cartao/dialog-validar-cartao.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SharedPipesModule } from 'src/app/pipes/shared-pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComboPesquisavelOutlineModule } from '../common/combo-pesquisavel-outline/combo-pesquisavel-outline.module';
import { FullscreenModule } from '../fullscreen/fullscreen.module';


@NgModule({
  declarations: [ValidarCartaoComponent, DialogValidarCartaoComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
    FlexLayoutModule,
    MatButtonModule,
    RouterModule,
    SharedModule,
    MatSidenavModule,
    SharedDirectivesModule,
    TextMaskModule,
    MatStepperModule,
    MatOptionModule,
    MatSelectModule,
    SharedPipesModule,
    ComboPesquisavelOutlineModule,
    MatToolbarModule,
    FullscreenModule
  ]
})
export class ValidarCarteirinhaModule { }
