import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComboPesquisavelOutlineComponent } from './combo-pesquisavel-outline.component';
import { ComboPesquisavelModule } from 'src/app/components/common/combo-pesquisavel/combo-pesquisavel.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    MatTooltipModule,
    NgxMatSelectSearchModule,
    ScrollingModule

  ],

  declarations: [
    ComboPesquisavelOutlineComponent,
  ],

  exports: [
    ComboPesquisavelOutlineComponent,
  ],

  entryComponents: [],
  providers: []
})
export class ComboPesquisavelOutlineModule { }
