import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Menu } from 'src/app/components/menu/menu.model';
import { Modulo } from 'src/app/core/modulo';


@Injectable({
  providedIn: 'root'
})
export class MenuBuilder  {

  constructor() { }

  build(moduloTO: Modulo) {
    return new Menu(moduloTO.id, 
                    moduloTO.descricao, 
                    moduloTO.routerLink, 
                    moduloTO.href, 
                    moduloTO.icone, 
                    moduloTO.target,
                    moduloTO.agrupador,
                    moduloTO.moduloPai?.id
                    );
  }

}

