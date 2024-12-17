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
}
