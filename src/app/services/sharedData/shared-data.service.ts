import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  constructor(private httpClient:HttpClient) { }

  getUserPolicyData():Observable<any>
  {
    return this.httpClient.get(environment.apiUrl+"SharedData/userPolicyData");
  }
  getPagesCategoriesData():Observable<any>
  {
    return this.httpClient.get(environment.apiUrl+"SharedData/pageCategoriesData");
  }
  getUserActionsProcessTypesData():Observable<any>
  {
    return this.httpClient.get(environment.apiUrl+"SharedData/userActionsProcessTypesData");
  }
}
