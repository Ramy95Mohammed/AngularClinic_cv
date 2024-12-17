import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LocalizeService {
  localizeData:any[]=[];
  constructor(private httpClient:HttpClient) { }

  getLocalizeData(): Observable<any>
  {    
    return this.httpClient.get(environment.apiUrl+'Localize');
  }


  getLabelValue(name: string): string {
    const foundItem =this.localizeData.find(item => item.name === name);
    return foundItem ? foundItem.value : '';
  }
}
