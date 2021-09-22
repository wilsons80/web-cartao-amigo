import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'
import { MenuPrincipalService } from './menuPrincipal/menu-principal.service';


@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  // With this subject you can save the sidenav state and consumed later into other pages.
  public sideNavState$: Subject<boolean> = new Subject();

  sideNavState: boolean = false;
  linkText: boolean = false;

  constructor(
    private menuPrincipalService: MenuPrincipalService,
    ) {
     
      this.menuPrincipalService.toggle.subscribe((resposta) => {
        if (resposta && resposta.logout == true) {
  
        } else
          this.onSinenavToggle();
      });
  }

  onSinenavToggle() {
    this.sideNavState = !this.sideNavState

    setTimeout(() => {
      this.linkText = this.sideNavState;
    }, 200)
    this.sideNavState$.next(this.sideNavState)
  }
}

