import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UsersActionsService {

  constructor(private _httpClient:HttpClient) { }

  // getUsersActionsData(pageIndex:number , pageSize:number,searchValue:string|null,sort:string | null,entityState:any,dateFrom:any
  //   , dateTo:any):Observable<any>
  // {
  //   return this._httpClient.get(environment.apiUrl+"UserActions?pageIndex="+pageIndex+"&pageSize="+pageSize+"&searchValue="+searchValue+"&sort="+sort
  //   +"&entityState="+entityState+"&dateFrom="+dateFrom+"&dateTo="+dateTo);
  // }

  getUsersActionsData(
    pageIndex: number, 
    pageSize: number, 
    searchValue: string | null, 
    sort: string | null, 
    entityState: any | null, 
    dateFrom: Date | null, 
    dateTo: Date | null
  ): Observable<any> {
  
    // Build the query parameters
    let params: string[] = [];
  
    params.push(`pageIndex=${pageIndex}`);
    params.push(`pageSize=${pageSize}`);
  
    if (searchValue) {
      params.push(`searchValue=${encodeURIComponent(searchValue)}`);
    }
  
    if (sort) {
      params.push(`sort=${encodeURIComponent(sort)}`);
    }
  
    // Only add entityState if it's not null
    if (entityState !== null && entityState !== undefined) {
      params.push(`entityState=${encodeURIComponent(entityState)}`);
    }
  
    // Only add dateFrom if it's not null
    if (dateFrom !== null && dateFrom !== undefined) {
      params.push(`dateFrom=${encodeURIComponent(dateFrom.toISOString())}`); // Convert Date to ISO string
    }
  
    // Only add dateTo if it's not null
    if (dateTo !== null && dateTo !== undefined) {
      params.push(`dateTo=${encodeURIComponent(dateTo.toISOString())}`); // Convert Date to ISO string
    }
  
    // Join all the query parameters
    const queryString = params.join("&");
  
    // Make the HTTP GET request with the query string
    return this._httpClient.get(environment.apiUrl + "UserActions?" + queryString);
  }


  deleteSelectedUsersActions(selectedUsersActions:any[]):Observable<any>
  {
     return this._httpClient.delete(environment.apiUrl+"UserActions" ,{
        headers:new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        
        body: selectedUsersActions
     } );
  }
  
}
