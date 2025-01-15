import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { FormArray, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  sectionsData: any[] = [];
  constructor(private httpClient: HttpClient) { }

  getUserPolicyData(): Observable<any> {
    return this.httpClient.get(environment.apiUrl + "SharedData/userPolicyData");
  }
  getPagesCategoriesData(): Observable<any> {
    return this.httpClient.get(environment.apiUrl + "SharedData/pageCategoriesData");
  }
  getUserActionsProcessTypesData(): Observable<any> {
    return this.httpClient.get(environment.apiUrl + "SharedData/userActionsProcessTypesData");
  }
  getActivityStatusData(): Observable<any> {
    return this.httpClient.get(environment.apiUrl + "SharedData/activityStatusData");
  }
  getAppUserTypeData(): Observable<any> {
    return this.httpClient.get(environment.apiUrl + "SharedData/appUserTypeData");
  }
  getweekDaysData(): Observable<any> {
    return this.httpClient.get(environment.apiUrl + "SharedData/weekDaysData");
  }

  getAvailableStatusData(): Observable<any> {
    return this.httpClient.get(environment.apiUrl + "SharedData/availableStatus");
  }
  getTypeOfMedicalExaminationData(): Observable<any> {
    return this.httpClient.get(environment.apiUrl + "SharedData/typeOfMedicalExaminationData");
  }
  getGenderData(): Observable<any> {
    return this.httpClient.get(environment.apiUrl + "SharedData/genderData");
  }
  getAcademicDegreeData(): Observable<any> {
    return this.httpClient.get(environment.apiUrl + "SharedData/academicDegreeData");
  }

  getSectionsData(): Observable<any> {
    return this.httpClient.get(environment.apiUrl + "SharedData/sectionsData");
  }

  setSectionsData() {
       this.getSectionsData().subscribe((res)=>{
        this.sectionsData = res;
       });
  }

  getAdminUsersData():Observable<any>
  {
    return this.httpClient.get(environment.apiUrl + "SharedData/adminUsersData");
  }
  
}