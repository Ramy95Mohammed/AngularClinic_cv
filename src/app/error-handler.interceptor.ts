import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  
  return next(req);
//   .pipe(

    
//   catchError((error: HttpErrorResponse) => {
//     let errorMessage :any;

//     if (error.status === 400) {
//       errorMessage = 'Bad Request';
//     } else if (error.status === 401) {
//       errorMessage = 'Unauthorized. Please log in.';
//     } else if (error.status === 500) {
//       errorMessage = 'Internal Server Error';
//     } else if (error.status === 0) {
//       errorMessage = 'Network error. Please check your internet connection.';
//     }
//     else errorMessage = error;

//     // Optionally, use a service like Toastr to show an error message
//     alert(errorMessage);

//     // Return an observable with a user-facing error message
//     return throwError(() => new Error(errorMessage));
//   })
// );
};
