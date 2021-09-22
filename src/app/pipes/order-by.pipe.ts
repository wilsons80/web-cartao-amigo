import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(array: any[], args?: any): any {
    return array.sort((a, b) => a[args] < b[args] ? -1 : a[args] > b[args] ? 1 : 0);
  }

}
