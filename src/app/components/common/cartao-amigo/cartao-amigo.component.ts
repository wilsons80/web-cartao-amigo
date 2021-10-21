import { Component, OnInit, ChangeDetectorRef, Input, forwardRef } from '@angular/core';
import * as _ from 'lodash';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { TitularService } from 'src/app/services/titular/titular.service';
import { Cartao } from 'src/app/core/cartao';

@Component({
  selector: 'cartao-amigo',
  templateUrl: './cartao-amigo.component.html',
  styleUrls: ['./cartao-amigo.component.css']
})
export class CartaoAmigoComponent implements OnInit {

  @Input() cartao: Cartao;
  @Input() nomeImpresso: string;

  masks: any;
  
  pinDependente = Date.now();
  
  constructor(public titularService: TitularService,
              private drc: ChangeDetectorRef) {
  }

  ngOnInit() {
    
  }

  
  ngAfterContentChecked(): void {
    this.drc.detectChanges();
  }


  
  getImagemCartao() {
    return 'https://s3.amazonaws.com/cartaoamigo.com.br/imagens/cartao-frente.png';
  }


  getUrlQrCode() {
    return 'https://chart.googleapis.com/chart?chf=bg,s,FFFFFF00&amp&chs=130x130&cht=qr&chl=' + this.cartao.urlCode;
  }
}