import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Acesso } from 'src/app/core/acesso';
import { Modulo } from 'src/app/core/modulo';
import { Modulos } from 'src/app/core/modulos';
import { GrupoAcessoModulos } from 'src/app/core/grupo-acesso-modulos';
import { ControlContainer, NgForm } from '@angular/forms';
import { ToastService } from 'src/app/services/toast/toast.service';
import * as _ from 'lodash';

export class FilterModulos{
	modulo: Modulo = new Modulo();
}

@Component({
  selector: 'formulario-modulo',
  templateUrl: './formulario-modulo.component.html',
  styleUrls: ['./formulario-modulo.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class FormularioModuloComponent implements OnInit {

  @ViewChild('campoModulo') campoModulo;
  
  @Input() grupos: GrupoAcessoModulos[];
  @Input() index: number;
  @Input() grupo: GrupoAcessoModulos;
  @Input() perfilAcesso: Acesso;
  @Input() modulos: Modulo[];

  pinModulo    = Date.now();

  filtro: FilterModulos;

  constructor(private drc: ChangeDetectorRef,
              private toastService: ToastService) { }

  ngOnInit(): void {
    this.filtro = new FilterModulos();
    this.filtro.modulo = new Modulo();
  }

  ngAfterContentChecked(): void {
    this.drc.detectChanges();

    this.preencherCombo();
  }

  private preencherCombo(){
    if (this.grupo.modulo && this.grupo.modulo.id && this.modulos.length) {
      this.filtro.modulo = _.find(this.modulos, { id: this.grupo.modulo.id});
    }
  } 

  deletar() {
    this.grupos.splice(this.index, 1);
  }
  

  onValorChangeModulo(registro: any) {
    this.grupo.modulo = registro;
    
    if(registro) {
      this.grupo.modulo.id = registro.id;
      this.validarDuplicado();
    }else{  
      this.grupo.modulo = new Modulo();
    }

  }


  validarDuplicado() {
    if(this.filtro.modulo && this.filtro.modulo.id) {
      const jaExiste = this.grupos.find(m => m != this.grupo &&  m.modulo.id === this.filtro.modulo.id);
      if(jaExiste) {
        this.toastService.showAlerta('Esse módulo já está incluso.');
        this.campoModulo.itensSelect.control.setValue(null);
        this.filtro.modulo = new Modulo();        
      } else {
        this.carregarModulo();
      }
    }
  }


  
  carregarModulo() {
    if(this.filtro.modulo.id && this.grupo.modulo.id !== this.filtro.modulo.id){
      const modulo:any = _.cloneDeep(_.find(this.modulos,  (f: Modulo) => f.id === this.grupo.modulo.id));
      this.filtro.modulo = modulo;
    }
  }
}
