import { Clinica } from "./clinica";
import { TipoEspecialidade } from "./tipo-especialidade";

export class ClinicasTipoEspecialidade {                           
    id:number;                                      
    clinica:Clinica;                    
    tipoEspecialidade: TipoEspecialidade;
    valorParticular:number;               
    valorAssociado:number;                
    ativo:boolean;
    
    descricaoEspecialidade: string; // usado apenas em combo-pesquisavel
}