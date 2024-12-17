import { Component, OnInit, ViewChild, inject, AfterViewInit } from '@angular/core';
import { ImportsModule } from '../../../app/imports';
import { LocalizeService } from '../../../services/localize/localize.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../../services/account/account.service';
import { MessageService } from 'primeng/api';
import {Title} from "@angular/platform-browser";
import { SharedDataService } from '../../../services/sharedData/shared-data.service';
import { Dropdown } from 'primeng/dropdown';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ImportsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit ,AfterViewInit {
  @ViewChild('userPolicyDropdown') userPolicyDropdown!: Dropdown; 
 localizeServ:LocalizeService;
 registerForm:FormGroup;
 dir:string | undefined="";
 userPolicyData:any[]=[];
 constructor(private _localizeServ:LocalizeService ,private _accountService:AccountService,private messageService: MessageService,private titleService:Title , private sharedDataServ:SharedDataService){
  this.localizeServ = _localizeServ;
  this.registerForm =  this.intializeForm();

 
}
  ngAfterViewInit(): void {
    
  }
 ngOnInit(): void {
 
  let title=this._localizeServ.getLabelValue('lbl_registerUser');
  if( title !='')
  this.titleService.setTitle(title );
  this.getLayoutDirection();
 
  this.sharedDataServ.getUserPolicyData().subscribe(
    (data) => {    
      this.userPolicyData = data
      this.userPolicyData =  this.userPolicyData.filter((_, index) => index !== 3);   
    },
    (error) => {
    }
  );  
  }




 intializeForm():FormGroup
 {
  return new FormGroup({
    displayName:new FormControl(null,[Validators.required,Validators.pattern("^(?!\\s+$).+")]),
    userName:new FormControl(null),
    email:new FormControl(null,[Validators.required,Validators.email]),
    password:new FormControl(null , [Validators.pattern("^(?=^.{8,10}$)(?=.*\\d)(?=.*[a-z])(?=.*[a-z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\\s).*$"),Validators.required]),
    appUserType : new FormControl(0 , Validators.required),
    userPolicy : new FormControl(null , Validators.required),
  });
 }
    getLayoutDirection()
    {
      if (typeof document !== 'undefined') {
      this.dir =  document.getElementById('mainLayout')?.dir;
    }
   }
    
   registerUser()
   {
     if(this.registerForm.valid)
     {
        this._accountService.registerNewUser(this.registerForm).subscribe((data)=>{
          this.messageService.add({ severity:'success', summary: this.localizeServ.getLabelValue('lbl_success'),
           detail: this.localizeServ.getLabelValue('lbl_missionCompletedSuccessfully') });
           this.registerForm.reset();
        },
        (error)=>{
          if(error.error != null && error.error.errors != null && error.error.errors.length > 0)
          {
          if(error.error.errors[0] == 'This Email Already In Use')
          {
            this.messageService.add({ severity: 'error', summary: this.localizeServ.getLabelValue('lbl_error'),
             detail: this.localizeServ.getLabelValue('lbl_existUser') });
          }
        }

        });
     }
     else
     {
      this.registerForm.markAllAsTouched();
     }
   }

    
}
