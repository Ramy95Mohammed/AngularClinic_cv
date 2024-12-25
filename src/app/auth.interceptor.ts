import { HttpInterceptorFn } from '@angular/common/http';
import { AccountService } from './services/account/account.service';
import { inject } from '@angular/core';
import { CsrfService } from './services/sharedData/csrf.service';
import { CheckUserPermissionService } from './services/users/permissions/check-user-permission.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = inject(AccountService).getToken() || 'xyz';
  //const csrfToken = document.querySelector('input[name="__RequestVerificationToken"]')?.value;
  //const csrfToken = inject(CsrfService).getCsrfToken() || '';
  let userLang =  ''
  let lbl_tablesHeadersBackColors = '';
  let lbl_reportBackColor='';
  let lbl_subReportHeaderBackColor = '';
  let lbl_textColorForReport='';
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined')
  {
      userLang =  localStorage.getItem('userLanguage') || 'en-US';
      lbl_tablesHeadersBackColors =  localStorage.getItem('lbl_tablesHeadersBackColors') || '';
      lbl_reportBackColor =  localStorage.getItem('lbl_reportBackColor') || '';
      lbl_subReportHeaderBackColor =  localStorage.getItem('lbl_subReportHeaderBackColor') || '';
      lbl_textColorForReport =  localStorage.getItem('lbl_textColorForReport') || '';
  }
  // Clone the request to add the authentication header.
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authToken}`,
      'Accept-Language' : userLang ,
      //'X-CSRF-TOKEN': csrfToken  ,       
      'lbl_tablesHeadersBackColors':lbl_tablesHeadersBackColors,
      'lbl_reportBackColor':lbl_reportBackColor,
      'lbl_subReportHeaderBackColor':lbl_subReportHeaderBackColor,
      'lbl_textColorForReport':lbl_textColorForReport,
      'Content-Type': 'application/json' // Add CSRF token to the headers
    } 
   } );
   
  return next(authReq);
};
