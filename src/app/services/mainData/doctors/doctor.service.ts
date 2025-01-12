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
 
  saveDoctorData(value:FormData,options:{}):Observable<any>
  {
      return this._httpClient.post(environment.apiUrl+"Doctor" ,value  ,options);
  }
  editDoctorData(value:FormData,options:{}):Observable<any>
  {
      return this._httpClient.put(environment.apiUrl+"Doctor" ,value  ,options);
  }
  deleteDoctor(keyId:number)
  {
    return this._httpClient.delete(environment.apiUrl+"Doctor/"+keyId);
  }
  deleteImageFile(fileName:string , keyId:number):Observable<any>
  {
    return this._httpClient.delete(environment.apiUrl+"Doctor/deleteImageFile/"+keyId,{
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({ fileName: fileName }) 
    });
  }
  checkIfUserIsBooked(Id: string,keyId:number): Observable<any> {
    return this._httpClient.get<any>(environment.apiUrl+'Doctor/checkIfUserIsBooked?id='+Id+"&keyId="+keyId);
  
}
  
}
