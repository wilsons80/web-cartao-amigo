import { HttpParameterCodec } from '@angular/common/http';

// https://github.com/angular/angular/issues/11058
export class HttpFormParamCodec implements HttpParameterCodec {

  encodeKey(k: string): string {
    return encodeURIComponent(k);
  }

  encodeValue(v: string): string {
    return encodeURIComponent(v);
  }

  decodeKey(k: string): string {
    return decodeURIComponent(k);
  }

  decodeValue(v: string): string {
    return decodeURIComponent(v);
  }

}
