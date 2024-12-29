import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ThemeService } from './services/theme.service';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { NavBarComponent } from './Components/navBar/nav-bar/nav-bar.component';
import { PanelModule } from 'primeng/panel';
import { LocalizeService } from './services/localize/localize.service';
import { FloatLabel, FloatLabelModule } from 'primeng/floatlabel';
import { ImportsModule } from './app/imports';
import { MessageService } from 'primeng/api';
import { Title } from '@angular/platform-browser';
import { tap } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SlideBarComponent } from './Components/slideBar/slide-bar/slide-bar.component';
import { Sidebar } from 'primeng/sidebar';
import { CsrfService } from './services/sharedData/csrf.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { AccountService } from './services/account/account.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ImportsModule, NavBarComponent, SlideBarComponent],
  providers:[MessageService , SlideBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss' ,
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ opacity: 0 }),
        animate('0.7s ease-in-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class AppComponent implements OnInit{
  title = 'Prime x';
  dir='ltr';
  isLoading: boolean = true;  

  @ViewChild(SlideBarComponent) sideBarComponent!: SlideBarComponent;
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  } 

  _accountServ:AccountService;
constructor(private themeSerivce:ThemeService , private localizeServ:LocalizeService ,private csrfService: CsrfService , accountServ:AccountService
  ,private _appSideBar:SlideBarComponent)
{
   this._accountServ = accountServ;   
}
ngOnInit(): void {
   this.changeTheme('lara-dark-pink'); 
  this.getLocalizeData();
  //this.setCSRFConfig();
  this.setReportColors();
  this. getSharedData();
}
changeTheme(theme:string)
{
  this.themeSerivce.switchTheme(theme);
}

  getLocalizeData()
 {
  try {
   
    let userLang = localStorage.getItem('userLanguage')??'en-US';
    
      this.localizeServ.getLocalizeData().subscribe((data)=>{
        this.localizeServ.localizeData = data.localizedStrings;
        this.dir =userLang === 'ar-EG' ? 'rtl' : 'ltr';        
      });

  } catch (error) {
    
   }
  finally {
    this.isLoading = false;  // Once loading is complete, hide the progress bar
  }
 }

   setCSRFConfig()
   {
    this.csrfService.fetchCsrfToken().subscribe(response => {
      
      this.csrfService.setCsrfToken(response.csrfToken);
    });
   }

   setReportColors()
   {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined')
    {
      localStorage.setItem('lbl_subReportHeaderBackColor' , '#003366');
     localStorage.setItem('lbl_tablesHeadersBackColors' , '#008080');
      localStorage.setItem('lbl_reportBackColor' , '#4F4F4F');
      localStorage.setItem('lbl_textColorForReport' , 'white');
    }
   }


   
   getSharedData()
   {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined')
    {
      localStorage.setItem('getSharedData' , 'true');
    }
   }


}
