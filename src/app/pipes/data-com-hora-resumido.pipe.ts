import { Pipe, PipeTransform } from '@angular/core';
//import * as format from 'date-fns/format';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dataComHoraResumido'
})
export class DataComHoraResumidoPipe extends DatePipe  implements PipeTransform {

  transform(value: any, args?: any): any {
      return super.transform(value, 'dd/MM/yy \'às\' HH:mm', 'GMT-3','pt-BR');
  
  }

}