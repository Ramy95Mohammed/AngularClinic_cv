import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from './services/account/account.service';
import { CheckUserPermissionService } from './services/users/permissions/check-user-permission.service';

export const authGuard: CanActivateFn = (route, state) => {

  let currentUserToken = inject(AccountService).currentUser.getValue();
  let checkUserPermissionServ = inject(CheckUserPermissionService);
  let _router = inject(Router);
  if (currentUserToken != null) {
    //Check If User Has Page Access Permission , if not navigate to no permission page
    const controllerName = route.data['controller'];
    if (controllerName != '') {
      checkUserPermissionServ.check(controllerName, 5).subscribe((res) => {

        if (res)
          return true;
        else {
          alert('no permission');
          return false;
        }
      });
    }
    return true;
  }
  else {
    _router.navigate(['/app-login']);
    return false;
  }
};
