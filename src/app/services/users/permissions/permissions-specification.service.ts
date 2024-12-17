import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable, catchError, throwError } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PermissionsSpecificationService {

  constructor(private _httpClinet:HttpClient) { }
  getPermissionsDetails():Observable<any> 
  {
   return this._httpClinet.get(environment.apiUrl+"PermissionsSpecification");
  }
  getPermissionsMaster(pageIndex:number , pageSize:number,searchValue:string,sort:string | null):Observable<any>
  {
    return this._httpClinet.get(environment.apiUrl+"PermissionsSpecification/permissionsMaster?pageIndex="+pageIndex+"&pageSize="+pageSize+"&searchValue="+searchValue+"&sort="+sort)
  }
  getPermissionMasterById(keyId:number):Observable<any> 
  {
   return this._httpClinet.get(environment.apiUrl+"PermissionsSpecification/permissionMasterById/"+keyId);
  }
  saveNewPermissionsSpecData(frm:FormGroup):Observable<any>
  {
     return this._httpClinet.post(environment.apiUrl+"PermissionsSpecification" , frm.value);     
  }

  updatePermissionsSpecData(frm:FormGroup):Observable<any>
  {
     return this._httpClinet.put(environment.apiUrl+"PermissionsSpecification" , frm.value);     
  }
  deletePermissionsSpecDataWithDetails(keyId:number):Observable<any>
  {
    return this._httpClinet.delete(environment.apiUrl+"PermissionsSpecification/"+keyId);     
  }


  ///Users Permissions
  getusersWithoutPermissionsData():Observable<any> 
  {
   return this._httpClinet.get(environment.apiUrl+"PermissionsSpecification/usersWithoutPermissions");
  }
  getUserHavePermissionsById(keyId:number):Observable<any> 
  {
   return this._httpClinet.get(environment.apiUrl+"PermissionsSpecification/usersHavePermissions/"+keyId);
  }

}

