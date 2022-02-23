import { PessoaFisica } from 'src/app/core/pessoa-fisica';
import { Component, OnInit, Input, forwardRef, ChangeDetectorRef } from '@angular/core';
import { EnderecoService } from 'src/app/services/endereco/endereco.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { of } from 'rxjs';
import { ControlContainer, NgForm, NgModelGroup } from '@angular/forms';
import { CartaoService } from 'src/app/services/cartao/cartao.service';
import { Cartao } from 'src/app/core/cartao';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { BroadcastEventService } from 'src/app/services/broadcast-event/broadcast-event.service';

@Component({
  selector: 'dados-cartao',
  templateUrl: './dados-cartao.component.html',
  styleUrls: ['./dados-cartao.component.css'],
  viewProviders:  [
    { provide:  ControlContainer, useExisting:  NgForm },
    { provide: ControlContainer, useExisting: forwardRef(() => NgModelGroup) }]
})
export class DadosCartaoComponent implements OnInit {

  @Input() idPessoaFisica;
  @Input() cartao = new Cartao();
  @Input() nomeImpresso: string;
  @Input() desabilitarCampos = false;

  pinCartao = Date.now();

  constructor(private drc: ChangeDetectorRef,
              private cartaoService: CartaoService,              
              private dataUtilService: DataUtilService,) { }

  ngOnInit() {
    BroadcastEventService.get('PAGAMENTO_REALIZADO').subscribe((valor) => {
      this.onCarregarDadosCartao();
    })
  }

  onCarregarDadosCartao() {
    if(this.idPessoaFisica) {
      const _observable = this.cartao.isTitular ? this.cartaoService.getCartaoTitularByIdPessoaFisica(this.idPessoaFisica)
                                                : this.cartaoService.getCartaoDependenteByIdPessoaFisica(this.idPessoaFisica);
      _observable.subscribe((cartao: Cartao) => {
        this.cartao = cartao;
      })
    }
  }
  
  ngAfterContentChecked(): void {
    this.drc.detectChanges();
  }

  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }

}
