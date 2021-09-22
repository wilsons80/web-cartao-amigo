import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClinicasRoutingModule } from './corretor-routing.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComboPesquisavelModule } from '../common/combo-pesquisavel/combo-pesquisavel.module';
import { CorretorComponent } from './corretor.component';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingPopupModule } from 'src/app/services/loadingPopup/loading-popup.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CadastroEnderecoModule } from '../common/cadastro-endereco/cadastro-endereco.module';
import { CorretorDialogComponent } from './corretor-dialog/corretor-dialog.component';
import { SharedPipesModule } from 'src/app/pipes/shared-pipes.module';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


@NgModule({
  declarations: [CorretorComponent,
                 CorretorDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedModule,    
    ComboPesquisavelModule,
    NgxPaginationModule,
    SharedModule,
    PipesModule, 
    SharedPipesModule,
    SharedDirectivesModule,
    ClinicasRoutingModule,
    LoadingPopupModule,
    CadastroEnderecoModule ,
    MatProgressSpinnerModule,
    MatSlideToggleModule
  ]
})
export class CorretorModule { }
