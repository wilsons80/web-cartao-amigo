import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { DadosCartaoComponent } from './dados-cartao.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CartaoAmigoComponent } from '../cartao-amigo/cartao-amigo.component';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [DadosCartaoComponent, CartaoAmigoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule,
    PipesModule,
    MatSlideToggleModule,
    SharedDirectivesModule,
    MatCardModule
  ],
  exports:[DadosCartaoComponent, CartaoAmigoComponent]
})
export class DadosCartaoModule { }
