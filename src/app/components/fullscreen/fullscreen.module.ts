import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { FullScreenComponent } from './fullscreen.component';

@NgModule({
  declarations: [FullScreenComponent],
  exports:[FullScreenComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,    
    MatIconModule,
  ]
})
export class FullscreenModule { }