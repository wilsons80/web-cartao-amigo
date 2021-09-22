import { HTTP_INTERCEPTORS, HttpBackend } from '@angular/common/http';
import { NgModule, InjectionToken, Injector } from '@angular/core';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { HttpLoadingInterceptor } from './http-loading.interceptor';
import { bypassHttpErrorFactory } from './http-client-factory.provider';

export const HTTP_BYPASS_INTERCEPTOR = new InjectionToken("http_bypass_interceptor");

@NgModule({
  providers: [
    {
      provide: HTTP_BYPASS_INTERCEPTOR,
      deps: [HttpBackend, Injector],
      useFactory: bypassHttpErrorFactory
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpLoadingInterceptor,
      multi: true,
    }
  ],
})
export class HttpMgmtModule { }
