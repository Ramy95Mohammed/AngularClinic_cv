import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, take, throwError } from 'rxjs';
import { CheckUserPermissionService } from './services/users/permissions/check-user-permission.service';
import { CustomConfirmDialogComponent } from './Components/customComponents/customConfirmDialogComponent/custom-confirm-dialog/custom-confirm-dialog.component';
import { CsrfService } from './services/sharedData/csrf.service';



export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  let csrfToken = '';
  inject(CsrfService).getCsrfToken().subscribe((res=>{
    csrfToken = res;
  }));
  const errReq = req.clone({
    setHeaders: {
      'X-CSRF-TOKEN': csrfToken,
      'Content-Type': 'application/json' 
    }, 
    
   }

   );
  

   return next(errReq);
  }

//   // return next(errReq);
//   return inject(CsrfService).getCsrfToken().pipe(
//     take(1),
//     switchMap(csrfToken => {
//       const clonedRequest = req.clone({
//         setHeaders: {
//           'X-CSRF-TOKEN': csrfToken,
//         },
//       });

//       // Log the request headers to verify CSRF token is included
//       console.log(clonedRequest.headers);

//       return next(clonedRequest);
//     })
//   );

// //   .pipe(

    
// //   catchError((error: HttpErrorResponse) => {
// //     let errorMessage :any;
// //     console.log(error.status);
// //     if (error.status === 403) {
      
// //       errorMessage = 'Forbidden';
// //       alert(errorMessage);
      
// //     }
// //     checkUserPermissionServ.typeOfOperation = "";
// //     //  else if (error.status === 401) {
// //     //   errorMessage = 'Unauthorized. Please log in.';
// //     // } else if (error.status === 500) {
// //     //   errorMessage = 'Internal Server Error';
// //     // } else if (error.status === 0) {
// //     //   errorMessage = 'Network error. Please check your internet connection.';
// //     // }
// //     // else errorMessage = error;

// //     // Optionally, use a service like Toastr to show an error message
// //     console.log(errorMessage);

// //     // Return an observable with a user-facing error message
// //     return throwError(() => new Error(errorMessage));
// //   })
// // );
// };

