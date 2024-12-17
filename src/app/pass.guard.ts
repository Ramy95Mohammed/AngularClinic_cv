import { CanActivateFn } from '@angular/router';

export const passGuard: CanActivateFn = (route, state) => {
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined')
  {
    if(localStorage.getItem('getSharedData') != null)
    return true;
  }
 return false;
};
