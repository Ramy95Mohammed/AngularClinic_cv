import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  currentUser = new BehaviorSubject(null);
token:string="";
  constructor(private _http:HttpClient,private _route: Router) {

    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined')
if(localStorage.getItem('userToken') != null)
{
 this.SaveCurrentUser();
}     
}
  

  registerNewUser(registerDto:FormGroup):Observable<any>
  {
      return this._http.post(environment.apiUrl+"Account/register",registerDto.value);
  }
  deleteUser(email:string)
  {
    return this._http.get(environment.apiUrl+"Account/delete/"+email);
  }
  loginUser(loginDto:FormGroup):Observable<any>
  {
    return this._http.post(environment.apiUrl+"Account/login",loginDto.value);
  }
  SaveCurrentUser()
  {
  
       let token:any = localStorage.getItem('userToken');
      // this.currentUser = jwtDecode(token);
      this.currentUser.next(jwtDecode(token)); // عملت الخطوه دى بدلا عن السطر السابق عشان استخدمت البيهيفيور سبجيكت
       //console.log(this.currentUser);
  }
       getToken():string | null
       {
         if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined')
        return localStorage.getItem('userToken');
      return '';
       }
       logOut()
       {
        
         localStorage.removeItem('userToken');         
         localStorage.removeItem('userDisplayName');   
         this.currentUser.next(null);
         this._route.navigate(['/app-login']);
       }     
    }
  
