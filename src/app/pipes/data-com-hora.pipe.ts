import { Pipe, PipeTransform } from '@angular/core';
//import * as format from 'date-fns/format';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dataComHora'
})
export class DataComHoraPipe extends DatePipe  implements PipeTransform {

  transform(value: any, args?: any): any {
      return super.transform(value, 'dd/MM/yyyy \'às\' HH:mm:ss', 'GMT-3','pt-BR');
  
  }

}