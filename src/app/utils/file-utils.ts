import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})

export class FileUtils {

    imageBlobUrl: any;

    constructor(private domSanitizer: DomSanitizer) {

    }

    convertBufferArrayToBase64(bufferArry: any) {
        if(bufferArry.byteLength){
            let TYPED_ARRAY = new Uint8Array(bufferArry);
    
            let base64String = btoa(new Uint8Array(TYPED_ARRAY).reduce(function (data, byte) {
                return data + String.fromCharCode(byte);
            }, ''));
            
            return this.domSanitizer.bypassSecurityTrustUrl(`data:image/jpg;base64,` + base64String);
        }
    }


    /**
     * Recebe um byte[] e faz o download do arquivo em excel
     * @param dados 
     */
    downloadFileXLS(dados, nomeArquivo) {
        const blob = new Blob([dados], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url= window.URL.createObjectURL(blob);
        var anchor = document.createElement("a");
        anchor.download = nomeArquivo;
        anchor.href = url;
        anchor.click();
    }

    /**
     * Recebe um byte[] e faz o download do arquivo em pdf
     * @param dados 
     */
    downloadFilePDF(dados, nomeArquivo) {
        const blob = new Blob([dados], { type: 'application/pdf' });
        const url= window.URL.createObjectURL(blob);
        var anchor = document.createElement("a");
        anchor.download = nomeArquivo;
        anchor.href = url;
        anchor.click();
    }
    

    showFilePDF(dados) {
        const blob = new Blob([dados], { type: 'application/pdf' });
        const fileURL = window.URL.createObjectURL(blob);
        window.open(fileURL, '_blank');
    }
    
    showFile(dados, nomeArquivo, contentType) {
        const file = new File([dados], nomeArquivo, { type: contentType });
        const fileURL = URL.createObjectURL(file);
        window.open(encodeURI(fileURL), '_blank');
        

        /*
        const blob = new Blob([dados], { type: contentType });
        const fileURL = URL.createObjectURL(blob);
        window.open(encodeURI(fileURL), '_blank');
        */

    }


    downloadFile(dados, nomeArquivo, contentType) {
        const blob = new Blob([dados], { type: contentType});
        const url= window.URL.createObjectURL(blob);
        var anchor = document.createElement("a");
        anchor.download = nomeArquivo;
        anchor.href = url;
        anchor.click();
    }

}

