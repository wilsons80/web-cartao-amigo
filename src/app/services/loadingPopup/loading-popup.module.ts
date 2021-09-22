import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoadingPopupComponent } from './loading-popup.component';

@NgModule({
  declarations: [
    LoadingPopupComponent
  ],
  entryComponents: [
    LoadingPopupComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    SharedModule
  ],
  exports: [
  ]
})
export class LoadingPopupModule {

}
