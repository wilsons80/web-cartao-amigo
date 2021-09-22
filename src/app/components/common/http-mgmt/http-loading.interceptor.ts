import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingIndicatorService } from 'src/app/services/loadingIndicator/loading-indicator.service';
import { Observable } from 'rxjs';

@Injectable()
export class HttpLoadingInterceptor implements HttpInterceptor {

  constructor(private loadingIndicatorService: LoadingIndicatorService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingIndicatorService.onStarted(req);
    return next.handle(req).pipe(finalize(() => this.loadingIndicatorService.onFinished(req)));
  }

}
