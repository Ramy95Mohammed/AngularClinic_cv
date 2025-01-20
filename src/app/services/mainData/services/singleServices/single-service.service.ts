import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SingleServiceService {

  constructor(private _httpClient:HttpClient) { }

  getSingleServicesData(pageIndex:number , pageSize:number,searchValue:string,sort:string | null,isActive:any):Observable<any>
  {
    let params: string[] = [];
  
    params.push(`pageIndex=${pageIndex}`);
    params.push(`pageSize=${pageSize}`);
  
    if (searchValue) {
      params.push(`searchValue=${encodeURIComponent(searchValue)}`);
    }
  
    if (sort) {
      params.push(`sort=${encodeURIComponent(sort)}`);
    }
  
    
    if (isActive !== null && isActive !== undefined) {
      params.push(`isActive=${encodeURIComponent(isActive)}`);
    }
    const queryString = params.join("&");
    return this._httpClient.get(environment.apiUrl+"SingleService?"+queryString);
  }
  saveNewService(value:any):Observable<any>
  {
    return this._httpClient.post(environment.apiUrl+"SingleService" , value);
  }
  editSingleService(value:any):Observable<any>
  {
    return this._httpClient.put(environment.apiUrl+"SingleService" , value);
  }
  getSingleServiceById(keyId:number):Observable<any>
  {
     return this._httpClient.get(environment.apiUrl+'SingleService/singleServiceById/'+keyId);
  }
  deleteSingleService(keyId:number):Observable<any>
  {
    return this._httpClient.delete(environment.apiUrl+'SingleService/'+keyId);
  }
}
