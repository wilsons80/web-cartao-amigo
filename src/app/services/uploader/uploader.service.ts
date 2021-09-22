import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class UploaderService {

  private extensoesAceitasMap: Map<string, number> = new Map<string, number>([
    // documento
    ['pdf', 10 * 1024 * 1024], // 10 Mb

    // imagem
    ['png', 3 * 1024 * 1024], // 3 Mb
    ['jpeg', 3 * 1024 * 1024], // 3 Mb
    ['jpg', 3 * 1024 * 1024], // 3 Mb

    // video
    ['mpeg', 50 * 1024 * 1024], // 50 Mb
    ['ogg', 50 * 1024 * 1024], // 50 Mb
    ['ogv', 50 * 1024 * 1024], // 50 Mb
    ['mp4', 50 * 1024 * 1024], // 50 Mb
    ['mp4a', 50 * 1024 * 1024], // 50 Mb
    ['mp4v', 50 * 1024 * 1024], // 50 Mb
    ['mov', 50 * 1024 * 1024], // 50 Mb

    // audio
    ['vorbis', 10 * 1024 * 1024], // 10 Mb
    ['mp3', 10 * 1024 * 1024], // 10 Mb
    ['wma', 10 * 1024 * 1024], // 10 Mb
    ['aac', 10 * 1024 * 1024], // 10 Mb
    ['wav', 50 * 1024 * 1024], // 50 Mb

    // outros
    ['p7s', 10 * 1024 * 1024], // 10 Mb
    ['odt', 10 * 1024 * 1024], // 10 Mb
    ['doc', 10 * 1024 * 1024], // 10 Mb
    ['docx', 10 * 1024 * 1024], // 10 Mb
    ['p7s', 10 * 1024 * 1024], // 10 Mb
  ]);

  getExtensoesPermitidas() {
    const extensoesIterator = this.extensoesAceitasMap.keys();
    return [...extensoesIterator]
      .map(extensao => `.${extensao}`) // adicionar ponto no início das extensões
      .join(', ');
  }

  isAceito(extensao: string): boolean {
    return this.extensoesAceitasMap.has(extensao);
  }

  isValidSize(file): boolean {
    const extensao = this.getExtensaoFile(file);
    const limite = this.extensoesAceitasMap.get(extensao);
    return file.size <= limite;
  }


  getExtensaoFile(file) {
    const extensao = file.name.split('.')[file.name.split('.').length - 1];
    return extensao.toLowerCase();
  }

  getExtension(filename) {
    const ext = filename.split('.').pop();

    return ext === filename ? '' : ext.toLowerCase();
  }

  appendToFormData(formData: FormData, anexo: any, prefix: string): any {
    _.toPairs(anexo).forEach(attr => {

      let key = attr[0];
      const value: any = attr[1];

      if (prefix) {
        key = prefix + key;
      }

      formData.append(key, value);
    });
  }

  getMiddleExtension(filename) {
    const parts = filename.split('.');
    const len = parts.length;

    return (len >= 3) ? parts[len - 2].toLowerCase() : '';
  }

}
