import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AppSettings } from 'src/app/app.settings';
import { Settings } from 'src/app/app.settings.model';
import { SessaoService } from 'src/app/services/sessao/sessao.service';
import * as _ from 'lodash';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ValidarCarteirinha } from 'src/app/core/validar-carteirinha';


@Component({
  selector: 'dialog-validar-cartao',
  templateUrl: './dialog-validar-cartao.component.html',
  styleUrls: ['./dialog-validar-cartao.component.scss']
})
export class DialogValidarCartaoComponent implements OnInit {
  
  dadosCartao: ValidarCarteirinha;
  public settings: Settings;
  
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    public sessaoService:SessaoService,
    public dialog: MatDialog,
    public appSettings: AppSettings,
    private drc: ChangeDetectorRef,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private dialogRef: MatDialogRef<DialogValidarCartaoComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) { 
    this.settings = this.appSettings.settings; 

    this.dadosCartao = data.dadosCartao;

    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);     
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.settings.loadingSpinner = false; 
    }); 
  }

  ngAfterContentChecked(): void {
    this.drc.detectChanges();
  }

  isMobile(): boolean {
    return this.mobileQuery.matches;
  }

  isNotMobile(): boolean {
    return !this.mobileQuery.matches;
  }

  cancelar() {
    this.dialogRef.close();
  }


  getLogoCartaoAmigo() {
    return '../../../../assets/imagens/LOGO_CARTAO_AMIGO-V2.2.jpg';
  }
}
