import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CheckUserPermissionService {
  public typeOfOperation: string = '';
  checkUserPermissionForm: FormGroup;
  constructor(private _httpClient: HttpClient) {
    this.checkUserPermissionForm = this.initcheckUserPermissionForm(null);
  }
  initcheckUserPermissionForm(per: any): FormGroup {
    return new FormGroup({
      operation: new FormControl(per?.operation),
      controllerName: new FormControl(per?.controllerName ?? "")
    });
  }

  check(ControllerName: string, operation: number):Observable<any> {
    this.checkUserPermissionForm.get('controllerName')?.setValue(ControllerName);
    this.checkUserPermissionForm.get('operation')?.setValue(operation);
  return  this._httpClient.post(environment.apiUrl + "PermissionsSpecification/checkUserPermission", this.checkUserPermissionForm.value)
  }
}
