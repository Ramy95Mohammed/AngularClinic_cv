import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SectionsService {

  constructor(private _httpClint:HttpClient) { }

  getSectionsData(pageIndex:number , pageSize:number,searchValue:string,sort:string | null):Observable<any>
  {
    return this._httpClint.get(environment.apiUrl+"Sections?pageIndex="+pageIndex+"&pageSize="+pageSize+"&searchValue="+searchValue+"&sort="+sort);
  }
  getSectionById(keyId:number):Observable<any>
  {
    return this._httpClint.get(environment.apiUrl+"Sections/sectionById/"+keyId);
  }
  saveNewSection(value:any):Observable<any>
  {
   return this._httpClint.post(environment.apiUrl+"Sections" , value);
  }
  editSection(value:any):Observable<any>
  {
   return this._httpClint.put(environment.apiUrl+"Sections" , value);
  }
  deleteSection(keyId:number)
  {
    return this._httpClint.delete(environment.apiUrl+"Sections/"+keyId);
  }
 
}
