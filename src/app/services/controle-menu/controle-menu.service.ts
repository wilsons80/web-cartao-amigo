import { Injectable } from '@angular/core';
import { Modulos } from 'src/app/core/modulos';
import { Menu } from 'src/app/core/menu';

@Injectable({
  providedIn: 'root'
})
export class ControleMenuService {


  logo: any;

  acessos: Menu[] = [];

  constructor() { }

  verificaAcessoModulo(tipoModulo: Modulos) {
    if (this.acessos) {
      const acesso = this.acessos.find(a => a.nomeModulo === tipoModulo);
      return acesso ? true : false;
    }

  }

}
