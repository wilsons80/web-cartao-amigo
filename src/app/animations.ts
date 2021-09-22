import { animate, state, style, transition, trigger } from '@angular/animations';

export const animacaoMenu =
    trigger('menuState', [
        state('hidden', style({
            visibility: 'hidden',
            opacity: 0
        })),
        state('show', style({
            visibility: 'visible',
            opacity: 1
        })),
        transition('*=>show', animate('500ms')),
    ]) 