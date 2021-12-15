import { ArquivoMetadados } from "./arquivo-metadado";

export class Clinica {                           
    id:number;                   
    codigo:string;             
    nomeFantasia:string;       
    nomeRazaoSocial:string;    
    endereco:string;           
    cep:number;                  
    bairro:string;             
    cidade:string;             
    uf:string;     
    numeroEndereco:string;
    complemento:string;
    telefone01:string;         
    telefone02:string;         
    celular:string;            
    email:string;              
    cnpj:string;               
    inscricaoEstadual:string;  
    inscricaoMunicipal:string; 
    homePage:string;           
    ativo:boolean;   
    metadados: ArquivoMetadados;     
    dataCadastro: Date; 
    cpf: string;    
                               
}