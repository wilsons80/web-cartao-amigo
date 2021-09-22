import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Acesso } from 'src/app/core/acesso';
import { Modulo } from 'src/app/core/modulo';
import { Modulos } from 'src/app/core/modulos';
import { GrupoAcessoModulos } from 'src/app/core/grupo-acesso-modulos';
import { ControlContainer, NgForm } from '@angular/forms';
import { ToastService } from 'src/app/services/toast/toast.service';
import * as _ from 'lodash';
import { GrupoAcesso } from 'src/app/core/grupo-acesso';
import { PerfilAcessoUsuario } from 'src/app/core/perfil-acesso-usuario';

export class Filter{
	grupoAcesso: GrupoAcesso = new GrupoAcesso();
}

@Component({
  selector: 'formulario-perfil-acesso',
  templateUrl: './formulario-perfil-acesso.component.html',
  styleUrls: ['./formulario-perfil-acesso.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class FormularioPerfilAcessoComponent implements OnInit {

  @ViewChild('campoGrupoAcesso') campoGrupoAcesso;
  
  @Input() perfis: PerfilAcessoUsuario[];
  @Input() perfil: PerfilAcessoUsuario;
  @Input() index: number;
  @Input() perfilAcesso: Acesso;
  @Input() gruposAcesso: GrupoAcesso[];

  pinGrupoAcesso    = Date.now();

  filtro: Filter;

  constructor(private drc: ChangeDetectorRef,
              private toastService: ToastService) { }

  ngOnInit(): void {
    this.filtro = new Filter();
    this.filtro.grupoAcesso = new GrupoAcesso();
  }

  ngAfterContentChecked(): void {
    this.drc.detectChanges();

    this.preencherCombo();
  }

  private preencherCombo(){
    if (this.perfil.grupoAcesso && this.perfil.grupoAcesso.id && this.gruposAcesso.length) {
      this.filtro.grupoAcesso = _.find(this.gruposAcesso, { id: this.perfil.grupoAcesso.id});
    }
  } 

  deletar() {
    this.perfis.splice(this.index, 1);
  }
  

  onValorChangeGrupoAcesso(registro: any) {
    this.perfil.grupoAcesso = registro;
    
    if(registro) {
      this.perfil.grupoAcesso.id = registro.id;
      this.validarDuplicado();
    }else{  
      this.perfil.grupoAcesso = new GrupoAcesso();
    }

  }


  validarDuplicado() {
    if(this.filtro.grupoAcesso && this.filtro.grupoAcesso.id) {
      const jaExiste = this.perfis.find(m => m != this.perfil &&  m.grupoAcesso.id === this.filtro.grupoAcesso.id);
      if(jaExiste) {
        this.toastService.showAlerta('Esse grupo de acesso já está incluso.');
        this.campoGrupoAcesso.itensSelect.control.setValue(null);
        this.filtro.grupoAcesso = new GrupoAcesso();        
      } else {
        this.carregarGrupoAcesso();
      }
    }
  }


  
  carregarGrupoAcesso() {
    if(this.filtro.grupoAcesso.id && this.perfil.grupoAcesso.id !== this.filtro.grupoAcesso.id){
      const grupoAcesso:any = _.cloneDeep(_.find(this.gruposAcesso,  (f: GrupoAcesso) => f.id === this.perfil.grupoAcesso.id));
      this.filtro.grupoAcesso = grupoAcesso;
    }
  }
}
