import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token            = localStorage.getItem('token');
    const idsessionusuario = localStorage.getItem('IDSESSIONUSUARIO');
  
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'Bearer '.concat(token))
                            .set('IDSESSIONUSUARIO', idsessionusuario)
      });

      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
