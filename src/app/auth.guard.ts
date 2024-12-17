import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from './services/account/account.service';

export const authGuard: CanActivateFn = (route, state) => {

  let currentUserToken = inject(AccountService).currentUser.getValue() ;
  let _router = inject(Router);
  // const componentName = route?.component?.name;
  // if(componentName == '_RegisterComponent')return true;
  if(currentUserToken != null){
//Check If User Has Page Access Permission , if not navigate to no permission page

    return true;
  }
  else{
    _router.navigate(['/app-login']);
  return false;
  }
};
