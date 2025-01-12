import { ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
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
export class AppComponent implements OnInit {
  title = 'Prime x';
  dir='ltr';
  isLoading: boolean = true;  
  routeAnimations: string ='';
  @ViewChild(SlideBarComponent) sideBarComponent!: SlideBarComponent;
  prepareRoute(outlet: RouterOutlet) {
    const currentUrl = this.router.url;  
    let routeData = (outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'])??currentUrl.replace('/','');    
    return routeData;
  } 

  _accountServ:AccountService;
constructor(private themeSerivce:ThemeService , private localizeServ:LocalizeService ,private csrfService: CsrfService , accountServ:AccountService
  ,private _appSideBar:SlideBarComponent,private cdRef: ChangeDetectorRef,private router: Router) 
{
   this._accountServ = accountServ;   
}
 
ngOnInit(): void {
   this.changeTheme('aura-dark-amber'); 
   this.setReportColors();
   this. getSharedData();  
  this.getLocalizeData();
  //this.setCSRFConfig();
 //this.loadAppContent();
 
 
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
        this.loadAppContent();

      });

  } catch (error) {
    
   }
  finally {
    //this.isLoading = false;  // Once loading is complete, hide the progress bar
  }
 }
 loadAppContent() {
  
  setTimeout(() => {
  
    this.isLoading = false;
  }, 2000); 
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
