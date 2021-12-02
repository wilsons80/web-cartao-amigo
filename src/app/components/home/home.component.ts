import { Router } from '@angular/router';
import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import { rotate } from 'src/app/utils/app-animation';
import { Settings } from 'src/app/app.settings.model';
import { AppSettings } from 'src/app/app.settings';
import { versions } from 'src/environments/versions';
import { environment } from 'src/environments/environment';
import { SessaoService } from 'src/app/services/sessao/sessao.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuBuilder } from 'src/app/services/builder/menu-builder';
import { ModuloService } from 'src/app/services/modulo/modulo.service';
import { Modulo } from 'src/app/core/modulo';
import { MenuService } from '../menu/menu.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [ rotate ],
  providers: [ MenuService ]
})
export class HomeComponent implements OnInit {

  @ViewChild('sidenav') sidenav:any;  
  
  versions = versions;
  environment = environment;

  public settings: Settings;
  public showSidenav:boolean = false;
  private defaultMenu:string; //declared for return default menu when window resized 
  public menus = ['vertical', 'horizontal'];
  public menuOption:string;
  public menuTypes = ['default', 'compact', 'mini'];
  public menuTypeOption:string;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(public sessaoService: SessaoService, 
              public router:Router,
              private menuService: MenuService,
              private moduloService: ModuloService,
              private menuBuilder: MenuBuilder,
              public appSettings:AppSettings,
              private drc: ChangeDetectorRef,
              changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,) {
    this.settings = this.appSettings.settings;

    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener); 
  }

  ngOnInit() {
    if(window.innerWidth <= 960){
      this.settings.menu = 'vertical';
      this.settings.sidenavIsOpened = false;
      this.settings.sidenavIsPinned = false;
    }
    this.menuOption = this.settings.menu; 
    this.menuTypeOption = this.settings.menuType; 
    this.defaultMenu = this.settings.menu;

  }


  ngAfterViewInit(){
    setTimeout(() => { this.settings.loadingSpinner = false }, 300); 

    if(this.settings.menu == "vertical") {
      this.moduloService.getAllModuloComAcesso().subscribe((modulos: Modulo[]) => {
        this.menuService.expandActiveSubMenu(modulos.map(m => this.menuBuilder.build(m)));
      });
    }
  }

  ngAfterContentChecked(): void {
    this.drc.detectChanges();
  }

  isMobile(): boolean {
    return this.mobileQuery.matches;
  }
  
  getLoadingCompleto() {
    return this.sessaoService.loadingCompleto;
  }

  public toggleSidenav(){
    this.sidenav.toggle();
  }


  changeLayoutHeader(){
    this.settings.fixedHeader = !this.settings.fixedHeader;
    this.salvarConfiguracaoAmbiente();
  }
  changeLayoutSidenav(){
    this.settings.fixedSidenav = !this.settings.fixedSidenav;
    this.salvarConfiguracaoAmbiente();
  }
  changeLayoutRTL(){
    this.settings.rtl = !this.settings.rtl;
    this.salvarConfiguracaoAmbiente();
  }


  public chooseMenu(){
    this.settings.menu = this.menuOption; 
    this.defaultMenu = this.menuOption;
    if(this.menuOption == 'horizontal'){
      this.settings.fixedSidenav = false;
    }
    this.router.navigate(['/']); 

    this.salvarConfiguracaoAmbiente();
  }

  public chooseMenuType(){
    this.settings.menuType = this.menuTypeOption;

    this.salvarConfiguracaoAmbiente();
  }

  

  @HostListener('window:resize')
  public onWindowResize():void {
    if(window.innerWidth <= 960){
      this.settings.sidenavIsOpened = false;
      this.settings.sidenavIsPinned = false;
      this.settings.menu = 'vertical'
    }
    else{
      (this.defaultMenu == 'horizontal') ? this.settings.menu = 'horizontal' : this.settings.menu = 'vertical'
      this.settings.sidenavIsOpened = true;
      this.settings.sidenavIsPinned = true;
    }
  }

  public closeSubMenus(){
    if(this.settings.menu == "vertical"){
      this.menuService.closeAllSubMenus();
    }
    
    this.salvarConfiguracaoAmbiente();
  }



  getLogoToolbar() {
    return '../../../assets/imagens/LOGO_CARTAO_AMIGO-V2.2.jpg';
  }
  getLogoHeaderFixo(){
    return '../../../assets/imagens/LOGO_CARTAO_AMIGO-V2.1-SEM-FUNDO.png';
  }

  salvarConfiguracaoAmbiente() {
    
  }


}




   