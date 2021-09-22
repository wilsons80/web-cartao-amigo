import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
import { RedefinirSenhaComponent } from './redefinir-senha.component';


@NgModule({
  declarations: [RedefinirSenhaComponent],
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
    MatStepperModule,
    MatOptionModule,
    MatSelectModule
  ]
})
export class RedefinirSenhaModule { }
