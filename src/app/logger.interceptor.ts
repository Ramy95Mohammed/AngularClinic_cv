import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { AccountService } from './services/account/account.service';

export const loggerInterceptor: HttpInterceptorFn = (req, next) => {
  
  let token = localStorage.getItem('userToken') || 'xyz';
  if(token)
  {
   req = req.clone({
    setHeaders:{'Authorization' : `Bearer ${token}`,
     'Content-Type':'application/json'
  }
  });
}


  // const url = req.url;
  // if(!(/\/api\/Localize\//.test(url)))
  // if(true)
  // {
  //   console.log('User Has No Permission');
  //   return throwError(() => new Error('Permission denied'));
  // }
  return next(req);
};
