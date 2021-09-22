import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppSettings } from 'src/app/app.settings';
import { Settings } from 'src/app/app.settings.model';
import { Modulo } from 'src/app/core/modulo';
import { MenuBuilder } from 'src/app/services/builder/menu-builder';
import { ModuloService } from 'src/app/services/modulo/modulo.service';
import { SessaoService } from 'src/app/services/sessao/sessao.service';
import { MenuService } from '../menu/menu.service';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ MenuService ]
})
export class SidenavComponent implements OnInit {
  
  public userImage = "../../../assets/img/no-profile.jpg";

  public menuItems:Array<any>;
  public settings: Settings;

  

  constructor(public appSettings: AppSettings, 
              public menuService:MenuService, 
              private moduloService: ModuloService,
              private menuBuilder: MenuBuilder,              
              private sessaoService: SessaoService,
              ){
      this.settings = this.appSettings.settings; 
  }

  ngOnInit() {
    this.moduloService.getAllModuloComAcesso().subscribe((modulos: Modulo[]) => {
      this.menuItems = modulos.map(m => this.menuBuilder.build(m));
    });
    
  }

  ngDoCheck(){    
  }

  public closeSubMenus(){
    let menu = document.getElementById("vertical-menu");
    if(menu){
      for (let i = 0; i < menu.children[0].children.length; i++) {
        let child = menu.children[0].children[i];
        if(child){
          if(child.children[0].classList.contains('expanded')){
              child.children[0].classList.remove('expanded');
              child.children[1].classList.remove('show');
          }
        }
      }
    }
  }



  naoPossuiFoto() {
    return "data:image/jpg;base64," === this.sessaoService.logo;
  }
}
