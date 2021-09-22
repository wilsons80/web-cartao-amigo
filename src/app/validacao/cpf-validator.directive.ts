import { Directive, Input, SimpleChanges } from '@angular/core';
import {NG_VALIDATORS, Validator, AbstractControl, ValidationErrors} from '@angular/forms';

@Directive({
  selector: '[cpfValidator]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: CpfValidatorDirective, multi: true }
  ]
})
export class CpfValidatorDirective implements Validator {

  @Input() cpfValidator = true;

  public validate(control: AbstractControl): ValidationErrors {
    let viewValue = control.value ? control.value.toString() : '';

    if(viewValue.length === 14) {
      viewValue = control.value.replace(/[^\d]+/g, '');
    }

    if (this.cpfValidator && viewValue) {
      let Soma = 0;
      let Resto;
      let i;
      let erro = { error: viewValue };

      if (viewValue == '')
        return null;

      if (viewValue.length != 11)
        return erro;

      if (viewValue == "00000000000" ||
        viewValue == "11111111111" ||
        viewValue == "22222222222" ||
        viewValue == "33333333333" ||
        viewValue == "44444444444" ||
        viewValue == "55555555555" ||
        viewValue == "66666666666" ||
        viewValue == "77777777777" ||
        viewValue == "88888888888" ||
        viewValue == "99999999999") {
        return erro;
      }

      for (i = 1; i <= 9; i++)
        Soma = Soma + parseInt(viewValue.substring(i - 1, i)) * (11 - i);

      Resto = (Soma * 10) % 11;

      if ((Resto == 10) || (Resto == 11))
        Resto = 0;

      if (Resto != parseInt(viewValue.substring(9, 10)))
        return erro;

      Soma = 0;

      for (i = 1; i <= 10; i++)
        Soma = Soma + parseInt(viewValue.substring(i - 1, i)) * (12 - i);

      Resto = (Soma * 10) % 11;

      if ((Resto == 10) || (Resto == 11))
        Resto = 0;

      if (Resto != parseInt(viewValue.substring(10, 11)))
        return erro;

      if (viewValue == "")
        return null;
    }
    return null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this._onChange = fn;
  }

  private _onChange: () => void;

  ngOnChanges(changes: SimpleChanges): void {
    if ('cpfValidator' in changes) {
      if (this._onChange) this._onChange();
    }
  }
}
