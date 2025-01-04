import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private _httpClient:HttpClient) { }
  saveDoctorData(value:any):Observable<any>
  {
      return this._httpClient.post(environment.apiUrl+"Doctor" ,value  ,{ responseType: 'json' });
  }
}
