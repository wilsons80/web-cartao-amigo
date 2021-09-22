import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataUtilService {

  constructor() { }


  /**
   * Transforma a string de data retornada pela extensão em um objeto Date do javascript.
   * @param {any} date O formato esperado dessa string é "dd/MM/yyyy HH:mm:ss".
   * @returns {Date} objeto Date configurado com a data transformada da string.
   */
  private parseDate(date: string): Date {
    const dataTruncada = this.getDataTruncata(date);

    const formatoISO = date.includes('T');
    const slicedDate = formatoISO ? date.split('T') : date.split(' ');
    
    if(slicedDate[1] && slicedDate[1].length > 0) {
      const hourMinuteSecond: any[] = slicedDate[1].split(':');
      dataTruncada.setHours(hourMinuteSecond[0]);
      dataTruncada.setMinutes(hourMinuteSecond[1]);
      dataTruncada.setSeconds(hourMinuteSecond[2]);
    } 

    return dataTruncada;
  }


  public getDataTruncata(date): Date {
    if(date === null || date === undefined) return null;

    let dataString = date;

    if(date && date instanceof Date) {
      dataString = date.toISOString();
    }

    const formatoISO = dataString.includes('T');    
    const slicedDate = formatoISO ? dataString.split('T') : dataString.split(' ');
    const dayMothYear:any[] = formatoISO ? slicedDate[0].split('-') : slicedDate[0].split('/');

    const ano = dayMothYear[formatoISO ? 0 : 2];
    const mes = dayMothYear[1] - 1;
    const dia = dayMothYear[formatoISO ? 2 : 0];

    const dataTruncada = new Date(ano, mes, dia);
    return dataTruncada;
  }


  public getValorByDate(valor): Date {
    if(valor === null || valor === undefined) return null;

    if(valor && valor instanceof Date) {
      return this.parseDate(valor.toLocaleDateString());
    }

    if(valor && typeof valor === 'string') {
      return this.parseDate(valor);
    }
   
  }
  /**
  * Verifica se as duas primeiras datas estão entre as duas últimas datas informadas. </br>
  * As datas de início são obrigatórios, devem ser informadas.
  * @param dataInicio 
  * @param dataFim 
  * @param dataPesquisaInicio 
  * @param dataPesquisaFim 
  */
  public isEntreDatasTruncada(dataInicio: Date, dataFim: Date, dataPesquisaInicio: Date, dataPesquisaFim: Date): boolean {
    const p_dataIni     = this.getDataTruncata(dataInicio);
    const p_dataFim     = this.getDataTruncata(dataFim);
    const p_dataPesqIni = this.getDataTruncata(dataPesquisaInicio);
    const p_dataPesqFim = this.getDataTruncata(dataPesquisaFim);
    return this.entreDatas(p_dataIni, p_dataFim, p_dataPesqIni, p_dataPesqFim );
  }

  public isEntreDatas(dataInicio: Date, dataFim: Date, dataPesquisaInicio: Date, dataPesquisaFim: Date): boolean {
    const p_dataPesqIni = this.getValorByDate(dataPesquisaInicio);
    const p_dataPesqFim = this.getValorByDate(dataPesquisaFim);
    const p_dataIni     = this.getValorByDate(dataInicio);
    const p_dataFim     = this.getValorByDate(dataFim);
    return this.entreDatas(p_dataIni, p_dataFim, p_dataPesqIni, p_dataPesqFim);
  }

  private entreDatas(dataInicio: Date, dataFim: Date, dataPesquisaInicio: Date, dataPesquisaFim: Date): boolean {
    if(this.getDataTruncata(dataInicio).getTime() < this.getDataTruncata(dataPesquisaInicio).getTime()) {
      return false;
    }
    return this.isVigente(dataInicio, dataPesquisaInicio, dataPesquisaFim) && this.isVigente(dataFim, dataPesquisaInicio, dataPesquisaFim);
  }


  private isVigente(dataReferencia: Date, dataIni: Date, dataFim: Date): boolean {
    if(!dataReferencia){ dataReferencia = this.getDataTruncata(new Date()); dataReferencia.setFullYear(dataReferencia.getFullYear() + 5000); }
    if(!dataFim){ dataFim = this.getDataTruncata(new Date()); dataFim.setFullYear(dataFim.getFullYear() + 5000);}

    if(this.getValorByDate(dataReferencia).getTime() >= this.getValorByDate(dataIni).getTime()
       &&
       this.getValorByDate(dataReferencia).getTime() <= this.getValorByDate(dataFim).getTime()
       ) {
      return true;
    }
    return false;
  }


  public isAnteriorHoje(dataReferencia: Date) {
    if(this.getValorByDate(dataReferencia).getTime() < Date.now()) {
      return true;
    }
    return false;
  }

  /**
   * Como usar mascara para campos com data no formato dd/MM/yyyy
   * 
   * (input)="onInput($event)"
   * @param event 
   */
  onMascaraDataInput(event) {
    const value: string = event.target.value.replace(/\D/g, '');
    if (value.length <= 2) {
      event.target.value = value;
    } else if (value.length <= 4) {
      event.target.value = value.substring(0, 2) + '/' + value.substring(2, 4);
    } else {
      event.target.value = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 8);
    }
  }

   /**
   * Como usar
   * 
   * (input)="onInput($event)"
   * @param event 
   */
  validaCep(cep) {
    const regex = /^\d{2}((?!000000).)*$/;
    return regex.test(cep);
  }


  dateAsYYYYMMDDHHNNSS(date): string {
    return date.getFullYear()
              + '' + this.leftpad(date.getMonth() + 1, 2)
              + '' + this.leftpad(date.getDate(), 2)
              + '' + this.leftpad(date.getHours(), 2)
              + '' + this.leftpad(date.getMinutes(), 2)
              + '' + this.leftpad(date.getSeconds(), 2);
  }
  
  leftpad(val, resultLength = 2, leftpadChar = '0'): string {
    return (String(leftpadChar).repeat(resultLength)
          + String(val)).slice(String(val).length);
  }
}
