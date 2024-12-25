import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CsrfService {
  private csrfToken: string | null = null;
  
  constructor(private http: HttpClient) { }
  fetchCsrfToken(): Observable<any> {
    return this.http.get(environment.apiUrl+"SecurityCSRF/GetCsrfToken");
  }
  // Store the CSRF token in memory
  setCsrfToken(token: string): void {
    if(token)
    this.csrfToken = token;
  }

  // Get the CSRF token from memory
  // getCsrfToken(): string | null {
  //   return this.csrfToken;
  // }

  getCsrfToken(): Observable<string> {
    return this.http.get<{ csrfToken: string }>(environment.apiUrl+"SecurityCSRF/GetCsrfToken")
      .pipe(map(response => response.csrfToken));
  }

}
