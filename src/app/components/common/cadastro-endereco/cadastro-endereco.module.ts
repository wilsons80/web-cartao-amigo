import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CadastroEnderecoComponent } from './cadastro-endereco.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';



@NgModule({
  declarations: [CadastroEnderecoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule,
    PipesModule,
  ],
  exports:[CadastroEnderecoComponent]
})
export class CadastroEnderecoModule { }
