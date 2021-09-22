import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlContainer, NgForm, NgModel, NgModelGroup } from '@angular/forms';
import * as _ from 'lodash';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { LatinStringNormalizer } from 'src/app/utils/LatinStringNormalizer';

@Component({
  selector: 'combo-pesquisavel',
  templateUrl: './combo-pesquisavel.component.html',
  styleUrls: ['./combo-pesquisavel.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm },
  { provide: ControlContainer, useExisting: forwardRef(() => NgModelGroup) }],
  encapsulation: ViewEncapsulation.None
})

export class ComboPesquisavelComponent implements OnInit, OnChanges {

  @Input() itens: any[];
  @Input() itemId = 'id';
  @Input() itemLabel = '';
  @Input() itemDescricao = 'descricao';
  @Input() nome = 'item';
  @Input() obrigatorio = false; // se o parâmetro não for informado o campo não será obrigatório por default
  @Input() desabilitado = false; // se o parâmetro não for informado o campo não será habilitado por default
  @Input() multiplaSelecao = false; // se o parâmetro não for informado o campo não será seleção única por default
  @Input() placeholder = 'Digite para pesquisar...';
  @Input() showDisplayId: boolean = false;
  @Input() showDisplayItemLabel: boolean = false;
  @Input() label = ' '; // label que será mostrada após seleção do item na combo
  @Input() mostraCodigo = true;
  @Input() errorMessage = 'É preciso selecionar uma opção';

  placeHolderPesquise = "Pesquise...";
  @Input() valor: any = null;
  @Output() valorChange = new EventEmitter();

  @ViewChild('itensSelect', { static: true }) itensSelect: NgModel;
  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;

  data: any = {};
  item = null;
  itemSelecionado: any = {};
  itensFilter: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  _onDestroy = new Subject<void>();

  ngOnInit() {
   this.initValor();
   this.data = Date.now();
  }

  ngOnChanges(event) {
    if (event['itens']) { this.initItensFilter(); }
    if (event['valor']) { this.initValor(); }
  }

  onClick(event){
    this.initItensFilter();
  }

  private initValor() {
    if (this.itens && this.itens.length === 1) {
      this.item = this.itens[0];
    } else {
      this.item = !_.isEmpty(this.valor) ? this.valor : null;
    }
  }

  change(item: any) {
    this.valor = item;
    this.valorChange.emit(item);
  }

  itemToString(item: any) {
    if (item) {
      let result = this.showDisplayId ? item[this.itemId] : '';
      
      if (item[this.itemDescricao]) {
        result += (this.showDisplayId ? ' - ' : '') + item[this.itemDescricao];
      }

      result += this.showDisplayItemLabel ? ' - ' + item[this.itemLabel]  : '';

      return result;
    }
    return '';
  }

  filtrarItens(item: any) {
    this.filter(item, this.itens, this.itensFilter,
      (u, busca) => LatinStringNormalizer.search({ data: u[this.itemDescricao], query: busca }) ||
        LatinStringNormalizer.search({ data: u[this.itemId].toString(), query: busca })
    );
  }

  initItensFilter() {
    if (this.itens) {
      this.initFilter(this.itens, this.itensFilter, this.itensSelect,
        (a, b) => a && b && a[this.itemId] === b[this.itemId]);
    }
  }

  initFilter(dados: any[], dadosFilter: ReplaySubject<any[]>, select, selectedFunction) {
    dadosFilter.next(dados.slice());
    if (select) {
      dadosFilter
        .pipe(take(1), takeUntil(this._onDestroy))
        .subscribe(() => {
          select.compareWith = (a, b) => selectedFunction(a, b);
        });
    }
  }

  filter(chaveBusca: string, dados: any[], dadosFilter: ReplaySubject<any[]>, filterFunction) {
    if (!dados) {
      return;
    }
    let busca = chaveBusca;
    if (!busca) {
      dadosFilter.next(dados.slice());
      return;
    } else {
      busca = busca.toLowerCase();
    }
    dadosFilter.next(
      dados.filter(
        c => filterFunction(c, busca))
    );
  }
}

