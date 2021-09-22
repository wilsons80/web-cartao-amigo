import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FuncoesUteisService {

  constructor() { }


  /**
   * Retorna um array com valores distintos.
   * 
   * @param array 
   * @param nomeCampoDistinct 
   */
  arrayDistinct(array:any[], nomeCampoDistinct:string): any[] {
    const uniqueCombo: any[] = [];
    const distinctCombo: any[] = [];
    for( let i = 0; i < array.length; i++ ){
      if( !uniqueCombo[array[i][nomeCampoDistinct]]){
        distinctCombo.push(array[i]);
        uniqueCombo[array[i][nomeCampoDistinct]] = 1;
      }
    }
    return distinctCombo;
  }


  ordernarArray(array:any[], nomeCampoOrdenacao:string): any[]{
    array = array.filter(a => !!a[nomeCampoOrdenacao]);
    array.sort((a,b) => {
      if (a[nomeCampoOrdenacao] > b[nomeCampoOrdenacao]) {return 1;}
      if (a[nomeCampoOrdenacao] < b[nomeCampoOrdenacao]) {return -1;}
      return 0;
    });
    return array;
  }


  getApenasNumeros(valor) {
    if(!valor) return valor;
    return String(valor).replace(/\D/g, '');
  }
  
}
