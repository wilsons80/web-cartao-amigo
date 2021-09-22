import { Component, OnInit, Input, ViewEncapsulation, SimpleChanges } from '@angular/core';
import { AppSettings } from 'src/app/app.settings';
import { Settings } from 'src/app/app.settings.model';
import { LogoutService } from 'src/app/services/logout/logout.service';
import { SessaoService } from 'src/app/services/sessao/sessao.service';
import { MenuService } from '../menu.service';

@Component({
  selector: 'app-vertical-menu',
  templateUrl: './vertical-menu.component.html',
  styleUrls: ['./vertical-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ MenuService ]
})
export class VerticalMenuComponent implements OnInit {
  
  @Input('showMenuSair') showMenuSair = true;
  @Input('menuItems') menuItems;
  @Input('menuParentId') menuParentId;

  parentMenu:Array<any>;
  public settings: Settings;
  constructor(public appSettings: AppSettings, 
              public sessaoService: SessaoService,
              public menuService:MenuService,              
              private logoutService: LogoutService) { 
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {     
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['menuItems'] && this.menuItems && this.menuItems.length > 0) {
      this.parentMenu = this.menuItems.filter(item => item.parentId == this.menuParentId);  
    }
  }
  
  onClick(menuId){
    this.menuService.toggleMenuItem(menuId);
    this.menuService.closeOtherSubMenus(this.menuItems, menuId);  
  }

  logout() {
    this.logoutService.logout();
  }
}
