import { Routes } from '@angular/router';
import { HomeComponent } from './Components/Home/home/home.component';
import { RegisterComponent } from './Components/account/register/register.component';
import { LoginComponent } from './Components/account/login/login.component';
import { SectionComponent } from './Components/sections/section/section.component';

import { SpecifyPermissionsComponent } from './Components/users/permissions/specify-permissions/specify-permissions.component';
import { authGuard } from './auth.guard';
import { passGuard } from './pass.guard';
import { UsersActionComponent } from './Components/users/actions/users-action/users-action.component';

export const routes: Routes = [
    {path:"" , pathMatch:"full" , component:HomeComponent},
    {path:"app-home" , component:HomeComponent,
    data: { animation: 'app-home' ,
    controller:'Home'}
},
    {path:"app-register" ,canActivate:[passGuard], component:RegisterComponent,
    data: { animation: 'app-register',
    controller:'Account'
 }
}
    ,
    {path:"app-login" , component:LoginComponent,
    data: { animation: 'app-login' ,
    controller:'Account'}
},
    {path:"app-section" , canActivate:[authGuard], component:SectionComponent,
    data: { animation: 'app-section',
    controller:'Sections'
}},
    {path:"app-specify-permissions" , canActivate:[authGuard], component:SpecifyPermissionsComponent,
    data: { animation: 'app-specify-permissions',
    controller:'PermissionsSpecification' }
},
    {path:"app-users-action" , canActivate:[authGuard], component:UsersActionComponent,
    data: { animation: 'app-users-action',
    controller:'UserActions' } }

];
