import { Routes } from '@angular/router';
import { HomeComponent } from './Components/Home/home/home.component';
import { RegisterComponent } from './Components/account/register/register.component';
import { LoginComponent } from './Components/account/login/login.component';
import { SectionComponent } from './Components/sections/section/section.component';

import { SpecifyPermissionsComponent } from './Components/users/permissions/specify-permissions/specify-permissions.component';
import { authGuard } from './auth.guard';
import { passGuard } from './pass.guard';

export const routes: Routes = [
    {path:"" , pathMatch:"full" , component:HomeComponent},
    {path:"app-home" , component:HomeComponent},
    {path:"app-register" ,canActivate:[passGuard], component:RegisterComponent},
    {path:"app-login" , component:LoginComponent},
    {path:"app-section" , canActivate:[authGuard], component:SectionComponent},
    {path:"app-specify-permissions" , canActivate:[authGuard], component:SpecifyPermissionsComponent},
];
