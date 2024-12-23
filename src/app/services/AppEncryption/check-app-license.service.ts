import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CheckAppLicenseService {

  constructor(private _httpClient:HttpClient) { }
  checkLicense():Observable<any>
  {
    return this._httpClient.get(environment.apiUrl+"License");
  }
}
