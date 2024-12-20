import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { CheckUserPermissionService } from './services/users/permissions/check-user-permission.service';
import { CustomConfirmDialogComponent } from './Components/customComponents/customConfirmDialogComponent/custom-confirm-dialog/custom-confirm-dialog.component';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  let checkUserPermissionServ:any = inject(CheckUserPermissionService);  
  const errReq = req.clone({
    setHeaders: {
      'checkUserPermissionServ':checkUserPermissionServ.typeOfOperation,
      'Content-Type': 'application/json' 
    } 
   } );
  
  return next(errReq)
  .pipe(

    
  catchError((error: HttpErrorResponse) => {
    let errorMessage :any;
    console.log(error.status);
    if (error.status === 403) {
      
      errorMessage = 'Forbidden';
      alert(errorMessage);
      
    }
    checkUserPermissionServ.typeOfOperation = "";
    //  else if (error.status === 401) {
    //   errorMessage = 'Unauthorized. Please log in.';
    // } else if (error.status === 500) {
    //   errorMessage = 'Internal Server Error';
    // } else if (error.status === 0) {
    //   errorMessage = 'Network error. Please check your internet connection.';
    // }
    // else errorMessage = error;

    // Optionally, use a service like Toastr to show an error message
    console.log(errorMessage);

    // Return an observable with a user-facing error message
    return throwError(() => new Error(errorMessage));
  })
);
};
