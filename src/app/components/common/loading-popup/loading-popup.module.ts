import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingPopupComponent } from './loading-popup.component';



@NgModule({
  declarations: [LoadingPopupComponent],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
  ]
})
export class LoadingPopupModule { }
