import { CnpjPipe } from './cnpj.pipe';
import { FormatTimePipe } from './format-time.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataSimplesPipe } from './data-simples.pipe';
import { OrderByPipe } from './order-by.pipe';
import { CpfPipe } from './cpf.pipe';
import { HighlightPipe } from './highlight.pipe';
import { DataComHoraPipe } from './data-com-hora.pipe';
import { BytesPipe } from './bytes/bytes.pipe';
import { TelefonePipe } from './telefone-pipe';
import { DataComHoraResumidoPipe } from './data-com-hora-resumido.pipe';



@NgModule({
  declarations: [DataSimplesPipe, 
                 FormatTimePipe, 
                 CnpjPipe, 
                 CpfPipe, 
                 HighlightPipe, 
                 DataComHoraPipe,  
                 DataComHoraResumidoPipe,
                 OrderByPipe,
                 TelefonePipe,
                 BytesPipe],
  imports: [
    CommonModule
  ],
  exports:[DataSimplesPipe,
           FormatTimePipe, 
           OrderByPipe , 
           CnpjPipe, 
           HighlightPipe,
           DataComHoraPipe, 
           DataComHoraResumidoPipe,
           TelefonePipe,
           CpfPipe,
           BytesPipe]
})
export class SharedPipesModule { }
