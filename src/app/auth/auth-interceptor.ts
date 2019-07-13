import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.getToken();
    const clonedReq = req.clone({
      headers: req.headers.set('X-Auth', (token) ? token : 'gest')
    });
    return next.handle(clonedReq);
  }
}
