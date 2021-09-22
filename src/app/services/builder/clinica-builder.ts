import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Clinica } from 'src/app/core/clinica';


@Injectable({
  providedIn: 'root'
})
export class ClinicaBuilder {

  constructor() { }

  build(clinicaTO: Clinica) {
    const clinicaTela: any = {};

    clinicaTela.id                    = clinicaTO.id;
    clinicaTela.codigo                = clinicaTO.codigo;
    clinicaTela.nomeFantasia          = clinicaTO.nomeFantasia;
    clinicaTela.nomeRazaoSocial       = clinicaTO.nomeRazaoSocial;
    clinicaTela.endereco              = clinicaTO.endereco;
    clinicaTela.cep                   = clinicaTO.cep;
    clinicaTela.bairro                = clinicaTO.bairro;
    clinicaTela.cidade                = clinicaTO.cidade;
    clinicaTela.uf                    = clinicaTO.uf;
    clinicaTela.telefone01            = clinicaTO.telefone01;
    clinicaTela.telefone02            = clinicaTO.telefone02;
    clinicaTela.email                 = clinicaTO.email;
    clinicaTela.cnpj                  = clinicaTO.cnpj;
    clinicaTela.inscricaoEstadual     = clinicaTO.inscricaoEstadual;
    clinicaTela.inscricaoMunicipal    = clinicaTO.inscricaoMunicipal;
    clinicaTela.homePage              = clinicaTO.homePage;
    clinicaTela.ativo                 = clinicaTO.ativo;
    clinicaTela.dataCadastro          = clinicaTO.dataCadastro;


    return clinicaTela;
  }

}