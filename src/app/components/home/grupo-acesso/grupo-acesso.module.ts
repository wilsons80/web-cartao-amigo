import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrupoAcessoRoutingModule } from './grupo-acesso-routing.module';
import { GrupoAcessoComponent } from './grupo-acesso.component';
import { ComboPesquisavelModule } from '../../common/combo-pesquisavel/combo-pesquisavel.module';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingPopupModule } from '../../common/loading-popup/loading-popup.module';
import { GrupoAcessoDialogComponent } from './grupo-acesso-dialog/grupo-acesso-dialog.component';
import { FormularioModuloComponent } from './formulario-modulo/formulario-modulo.component';

@NgModule({
  declarations: [
                  GrupoAcessoComponent,
                  GrupoAcessoDialogComponent,
                  FormularioModuloComponent
                ],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    SharedModule,
    PipesModule, 
    GrupoAcessoRoutingModule,
    ComboPesquisavelModule,
    LoadingPopupModule,
    MatProgressSpinnerModule
  ]
})
export class GrupoAcessoModule { }
