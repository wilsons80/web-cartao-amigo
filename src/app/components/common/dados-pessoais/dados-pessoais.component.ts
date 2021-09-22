import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { PessoaFisica } from 'src/app/core/pessoa-fisica';
import { DataUtilService } from 'src/app/services/commons/data-util.service';
import { EnderecoService } from 'src/app/services/endereco/endereco.service';

@Component({
  selector:  'dados-pessoais',
  templateUrl:  './dados-pessoais.component.html',
  styleUrls:  ['./dados-pessoais.component.css'],
  viewProviders:  [{ provide:  ControlContainer, useExisting:  NgForm }]
})
export class DadosPessoaisComponent implements OnInit {

  @Input() pessoaFisica: PessoaFisica;
  @Input() permiteAlterar = true;
  @Input() obrigaDadosPessoais = true;
  
  
  public maskCep     = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  public maskPhone   = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public maskCelular = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  public mascaraCpf = [];

  ufs: any[] =[
    {nome:  'DF'}
  ]

  sexo: any[] =[
    {sigla:  'M', descricao:  'Masculino'},
    {sigla:  'F', descricao:  'Feminino'}
  ]

  sim_nao: any[] = [
    {tipo: 'Sim', flag: 'S'},
    {tipo: 'Não', flag: 'N'}
  ];  



  constructor(
    private enderecoService: EnderecoService,
    private dataUtilService: DataUtilService
  ) { }

  ngOnInit() {
    this.adicionarMascara();
    
    this.pessoaFisica.dataNascimento = this.pessoaFisica.dataNascimento  ? new Date(this.pessoaFisica.dataNascimento) : null;
    
    this.enderecoService.getAllEstados().subscribe((ufs: any)=> {
      this.ufs = ufs;
    });
  }

  onMascaraDataInput(event) {
    return this.dataUtilService.onMascaraDataInput(event);
  }

  adicionarMascara() {
    this.mascaraCpf = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/,];
  }
}
