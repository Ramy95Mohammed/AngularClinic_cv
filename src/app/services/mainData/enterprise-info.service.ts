import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseInfoService {

  constructor(private _httpClient: HttpClient) { }

  getEnterpriseInfo():Observable<any>
  {
    return this._httpClient.get(environment.apiUrl+'EnterpriseInfo');
  }
  saveEnterpriseInfoData(value:FormData,options:{}): Observable<any> {
   
    return this._httpClient.post(environment.apiUrl+'EnterpriseInfo' , value  , options);
  }
  deleteLogoFile(fileName:string):Observable<any>
  {
    return this._httpClient.delete(environment.apiUrl + 'EnterpriseInfo', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({ fileName: fileName })  // Sending the path as a JSON object
    });
  }
}
