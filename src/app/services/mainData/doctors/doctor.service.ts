import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {


  constructor(private _httpClient:HttpClient) { }

  getDoctorsData(pageIndex:number , pageSize:number,searchValue:string,sort:string | null):Observable<any>
  {
    return this._httpClient.get(environment.apiUrl+"Doctor?pageIndex="+pageIndex+"&pageSize="+pageSize+"&searchValue="+searchValue+"&sort="+sort);
  }

  getDoctorById(keyId:number)
  {
    return this._httpClient.get(environment.apiUrl+"Doctor/doctorById/"+keyId);
  }
 
  saveDoctorData(value:any):Observable<any>
  {
      return this._httpClient.post(environment.apiUrl+"Doctor" ,value  ,{ responseType: 'json' });
  }
  editDoctorData(value:any):Observable<any>
  {
      return this._httpClient.put(environment.apiUrl+"Doctor" ,value  ,{ responseType: 'json' });
  }
  deleteDoctor(keyId:number)
  {
    return this._httpClient.delete(environment.apiUrl+"Doctor/"+keyId);
  }
}
