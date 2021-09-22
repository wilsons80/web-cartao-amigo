import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Acesso } from 'src/app/core/acesso';
import { Modulo } from 'src/app/core/modulo';
import { Modulos } from 'src/app/core/modulos';
import { GrupoAcessoModulos } from 'src/app/core/grupo-acesso-modulos';
import { ControlContainer, NgForm } from '@angular/forms';
import { ToastService } from 'src/app/services/toast/toast.service';
import * as _ from 'lodash';
import { ClinicasTipoEspecialidade } from 'src/app/core/clinicas-tipo-especialidade';
import { TipoEspecialidade } from 'src/app/core/tipo-especialidade';

export class FilterModulos{
	especialidades: TipoEspecialidade = new TipoEspecialidade();
}

@Component({
  selector: 'formulario-especialidade',
  templateUrl: './formulario-especialidade.component.html',
  styleUrls: ['./formulario-especialidade.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class FormularioEspecialidadeComponent implements OnInit {

  @ViewChild('campoTipoEspecialidade') campoTipoEspecialidade;
  
  @Input() clinicaTipoEspecialidades: ClinicasTipoEspecialidade[];
  @Input() clinicaTipoEspecialidade: ClinicasTipoEspecialidade;
  @Input() index: number;
  @Input() tipoEspecialidades: TipoEspecialidade[];
  @Input() perfilAcesso: Acesso;


  pinCheckAtivo     = Date.now();
  pinValorClinica   = Date.now();
  pinValorAssociado = Date.now();

  filtro: FilterModulos;

  constructor(private drc: ChangeDetectorRef,
              private toastService: ToastService) { }

  ngOnInit(): void {
    this.filtro = new FilterModulos();
    this.filtro.especialidades = new TipoEspecialidade();
  }

  ngAfterContentChecked(): void {
    this.drc.detectChanges();

    this.preencherCombo();
  }

  private preencherCombo(){
    if (this.clinicaTipoEspecialidade.tipoEspecialidade && this.clinicaTipoEspecialidade.tipoEspecialidade.id && this.tipoEspecialidades?.length) {
      this.filtro.especialidades = _.find(this.tipoEspecialidades, { id: this.clinicaTipoEspecialidade.tipoEspecialidade.id});
    }
  } 

  deletar() {
    this.clinicaTipoEspecialidades.splice(this.index, 1);
  }
  

  onValorChange(registro: any) {
    this.clinicaTipoEspecialidade.tipoEspecialidade = registro;
    
    if(registro) {
      this.clinicaTipoEspecialidade.tipoEspecialidade.id = registro.id;
      this.validarDuplicado();
    }else{  
      this.clinicaTipoEspecialidade.tipoEspecialidade = new TipoEspecialidade();
    }

  }


  validarDuplicado() {
    if(this.filtro.especialidades && this.filtro.especialidades.id) {
      const jaExiste = this.clinicaTipoEspecialidades.find(m => m != this.clinicaTipoEspecialidade &&  m.tipoEspecialidade.id === this.filtro.especialidades.id);
      if(jaExiste) {
        this.toastService.showAlerta('Essa especialidade já está inclusa.');
        this.campoTipoEspecialidade.itensSelect.control.setValue(null);
        this.filtro.especialidades = new TipoEspecialidade();        
      } else {
        this.carregar();
      }
    }
  }


  
  carregar() {
    if(this.filtro.especialidades.id && this.clinicaTipoEspecialidade.tipoEspecialidade.id !== this.filtro.especialidades.id){
      const registro:any = _.cloneDeep(_.find(this.tipoEspecialidades,  (f: TipoEspecialidade) => f.id === this.clinicaTipoEspecialidade.tipoEspecialidade.id));
      this.filtro.especialidades = registro;
    }
  }
}
