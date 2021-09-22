import { NgModule } from '@angular/core';
import { CnpjValidatorDirective } from '../validacao/cnpj-validator.directive';
import { CpfValidatorDirective } from '../validacao/cpf-validator.directive';
import { CommonModule } from '@angular/common';
import { EditorPlaceholderDialogDirective } from './editor-placeholder-dialog.directive';


@NgModule({
  declarations: [
    CnpjValidatorDirective,
    CpfValidatorDirective,
    EditorPlaceholderDialogDirective
  ],

  exports: [
    CnpjValidatorDirective,
    CpfValidatorDirective,
    EditorPlaceholderDialogDirective
  ],

  imports: [
    CommonModule
  ]
})
export class SharedDirectivesModule { }
