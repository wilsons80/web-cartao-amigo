import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  transform(value: any, args: any): any {
    if (!args || !value) {return value;}
    const re = new RegExp(args, 'gi');
    return value.replace(re, '<span class="highlight">$&</span>');
}

}
