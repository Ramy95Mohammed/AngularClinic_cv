import { Component, OnInit } from '@angular/core';
import { ImportsModule } from '../../../app/imports';
import { LocalizeService } from '../../../services/localize/localize.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../../services/account/account.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ImportsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent  implements OnInit {
  localizeServ:LocalizeService;
  loginForm:FormGroup;
  dir:string | undefined="";
  error:string='';  
  constructor(private _localizeServ:LocalizeService ,private _accountService:AccountService,private messageService: MessageService, private _router:Router  ,private titleService:Title){
   this.localizeServ = _localizeServ;
   this.loginForm =  this.intializeForm();
 }
  ngOnInit(): void {
    this.getLayoutDirection();

    let title=this._localizeServ.getLabelValue('lbl_login');
    if( title !='')
    this.titleService.setTitle(title );
  }

 intializeForm():FormGroup
 {
  return new FormGroup({
    email:new FormControl(null,[Validators.required,Validators.email]),
    password:new FormControl(null , [Validators.pattern("^(?=^.{8,10}$)(?=.*\\d)(?=.*[a-z])(?=.*[a-z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\\s).*$"),Validators.required])
  });
 }
 getLayoutDirection()
 {
   if (typeof document !== 'undefined') {
   this.dir =  document.getElementById('mainLayout')?.dir;
 }
}
 loginUser()
 {
   if(this.loginForm.valid)
   {
      this._accountService.loginUser(this.loginForm).subscribe((data)=>{
        if(data.message = 'success')
        {        
          localStorage.setItem('userToken',data.token);
          // this._langData.displayName = response.displayName;
           localStorage.setItem('userDisplayName',data.displayName);
          // localStorage.setItem('userImage',response.userImage);
        //  this._langData.userImage=response.userImage;
          this._accountService.SaveCurrentUser();
          this._router.navigate(['/app-home']);
        //  localStorage.setItem("UserId",response.id);       
        }
        else
      {
        this.error=data.message;        
      }
      
      },
      (error)=>{
        if(error.error.statusCode == 401)
        {
          this.messageService.add({ severity: 'error', summary: this.localizeServ.getLabelValue('lbl_error'),
          detail: this.localizeServ.getLabelValue('lbl_userNotExists') });
        }
      });
   }
   else
   {
    this.loginForm.markAllAsTouched();
   }
}
}