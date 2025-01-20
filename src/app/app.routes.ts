import { Routes } from '@angular/router';
import { HomeComponent } from './Components/Home/home/home.component';
import { RegisterComponent } from './Components/account/register/register.component';
import { LoginComponent } from './Components/account/login/login.component';

import { SpecifyPermissionsComponent } from './Components/users/permissions/specify-permissions/specify-permissions.component';
import { authGuard } from './auth.guard';
import { passGuard } from './pass.guard';
import { UsersActionComponent } from './Components/users/actions/users-action/users-action.component';
import { NoPermissionComponent } from './Components/noPermissionComponent/no-permission/no-permission.component';
import { LicencePermissionComponent } from './Components/licencePermission/licence-permission/licence-permission.component';
import { SectionComponent } from './Components/MainData/sections/section/section.component';
import { EnterpriseInfoComponent } from './Components/MainData/EnterpriseInfo/enterprise-info/enterprise-info.component';
import { DoctorComponent } from './Components/MainData/doctors/doctor/doctor.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SingleServiceComponent } from './Components/MainData/services/single-service/single-service.component';

export const routes: Routes = [
    {path:"" , pathMatch:"full" , canActivate:[authGuard] ,component:HomeComponent},

    {path:"app-home" , component:HomeComponent,
    data: { animation: 'app-home' ,
    controller:'Home'}
},
    {path:"app-register" ,canActivate:[authGuard], component:RegisterComponent,
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

    {path:"app-enterprise-info" , canActivate:[authGuard], component:EnterpriseInfoComponent,
    data: { animation: 'app-enterprise-info',
    controller:'EnterpriseInfo'
}},
    {path:"app-specify-permissions" , canActivate:[authGuard], component:SpecifyPermissionsComponent,
    data: { animation: 'app-specify-permissions',
    controller:'PermissionsSpecification' }
},
    {path:"app-users-action" , canActivate:[authGuard], component:UsersActionComponent,
    data: { animation: 'app-users-action',
    controller:'UserActions' } },
    {path:"app-no-permission" , canActivate:[authGuard], component:NoPermissionComponent,
    data: { animation: 'app-no-permission'}    
},
{path:"app-licence-permission" , canActivate:[authGuard], component:LicencePermissionComponent,
    data: { animation: 'app-licence-permission'}
}
,
{path:"app-doctor" , canActivate:[authGuard], component:DoctorComponent,
    data: { animation: 'app-doctor' , controller:'Doctor'}
}
,
{path:"app-single-service" , canActivate:[authGuard], component:SingleServiceComponent,
    data: { animation: 'app-single-service' , controller:'SingleService'}
}



,
{ path: '**', component: PageNotFoundComponent, data: { animation: 'app-home'} },

];
