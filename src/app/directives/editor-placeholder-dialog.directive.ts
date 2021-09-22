import { Directive } from '@angular/core';
import { ArrayDataSource } from '@angular/cdk/collections';
import * as _ from 'lodash';

declare let CKEDITOR: any;

export const PLACEHOLDER_REGEXP = /\[\[(.*?)\]\]/g;

@Directive({
    selector: '[editorPlaceholderDialog]',
})
export class EditorPlaceholderDialogDirective {

    constructor() {
        CKEDITOR.on('dialogDefinition', (event) => {
            if ('placeholder' === event.data.name) {
                const input = event.data.definition.getContents('info').get('name');

                input.type = 'select';
                input.items = [];

                const variaveis = _.uniq(event.editor._.data.match(PLACEHOLDER_REGEXP) || []);
                variaveis.forEach(x => {
                    const variavel = (x + '').replace('[[', '').replace(']]', '');
                    input.items.push([variavel, variavel.replace(' ', '_')]);
                });

            }
        });
    }
}

