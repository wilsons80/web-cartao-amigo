import { Directive, Input } from '@angular/core';
import {Validator, NG_VALIDATORS, AbstractControl, ValidationErrors} from '@angular/forms';

@Directive({
  selector: '[cnpjValidator]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: CnpjValidatorDirective, multi: true }
  ]
})
export class CnpjValidatorDirective implements Validator {
  @Input() cnpjValidator = true;

  public validate(control: AbstractControl): ValidationErrors {
    let viewValue = control.value ? control.value.toString() : '';
    
    if(viewValue.length === 18){
      viewValue = control.value.replace(/[^\d]+/g, '');
    }

    if (this.cnpjValidator && viewValue) {
      let erro = {error: viewValue};

        if (viewValue == '')
          return null;

        if (viewValue.length != 14)
            return erro;

        // Elimina CNPJs invalidos conhecidos
        if (viewValue == "00000000000000" ||
            viewValue == "11111111111111" ||
            viewValue == "22222222222222" ||
            viewValue == "33333333333333" ||
            viewValue == "44444444444444" ||
            viewValue == "55555555555555" ||
            viewValue == "66666666666666" ||
            viewValue == "77777777777777" ||
            viewValue == "88888888888888" ||
            viewValue == "99999999999999")
            return erro;

        // Valida DVs
        var tamanho = viewValue.length - 2
        var numeros = viewValue.substring(0, tamanho);
        var digitos = viewValue.substring(tamanho);
        var soma = 0;
        var pos = tamanho - 7;
        var i

        for (i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0))
          return erro;

        tamanho = tamanho + 1;
        numeros = viewValue.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1))
          return erro;

    }

    return null;
  }

}
