import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosComponent } from './usuarios.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { ComboPesquisavelModule } from '../common/combo-pesquisavel/combo-pesquisavel.module';
import { LoadingPopupModule } from '../common/loading-popup/loading-popup.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CadastroEnderecoModule } from '../common/cadastro-endereco/cadastro-endereco.module';
import { UsuarioDialogComponent } from './usuario-dialog/usuario-dialog.component';
import { FormularioPerfilAcessoComponent } from './formulario-perfil-acesso/formulario-perfil-acesso.component';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DadosPessoaisModule } from '../common/dados-pessoais/dados-pessoais.module';
import { RouterModule } from '@angular/router';
import { SharedPipesModule } from 'src/app/pipes/shared-pipes.module';


@NgModule({
  declarations: [UsuariosComponent, 
                 FormularioPerfilAcessoComponent,
                 UsuarioDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    SharedModule,
    PipesModule,
    ComboPesquisavelModule,
    LoadingPopupModule,
    SharedPipesModule,
    MatProgressSpinnerModule,
    UsuariosRoutingModule, 
    SharedDirectivesModule,
    CadastroEnderecoModule ,
    MatDatepickerModule,
    DadosPessoaisModule,
    RouterModule,   
    SharedPipesModule,
  ]
})
export class UsuariosModule { }
