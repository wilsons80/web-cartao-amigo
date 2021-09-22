import { HTTP_INTERCEPTORS, HttpBackend, HttpClient, HttpHandler, HttpInterceptor, HttpRequest, HttpEvent } from '@angular/common/http';
import { InjectionToken, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpErrorInterceptor } from './http-error.interceptor';

export const bypassHttpErrorFactory = (backend: HttpBackend, injector: Injector) => getCustomHttpClient(backend, injector, { excludes: [HttpErrorInterceptor] });

const getCustomHttpClient = (backend: HttpBackend, injector: Injector, options: { excludes: Function[] } = { excludes: [] }) =>
  new HttpClient(new HttpDynamicInterceptingHandler(backend, injector, options));

class HttpDynamicInterceptingHandler implements HttpHandler {

  private chain: any = null;

  constructor(private backend: HttpBackend, private injector: Injector, private options: { excludes: Function[] } = { excludes: [] }) { }

  public handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    if (this.chain === null) {
      const interceptors = this.injector.get(HTTP_INTERCEPTORS, []).filter(entry => !this.options.excludes.includes(entry.constructor));
      this.chain = interceptors.reduceRight((next, interceptor) => new HttpInterceptorHandler(next, interceptor), this.backend);
    }
    return this.chain.handle(req);
  }

}

class HttpInterceptorHandler implements HttpHandler {

  constructor(private next: HttpHandler, private interceptor: HttpInterceptor) { }

  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    return this.interceptor.intercept(req, this.next);
  }

}
