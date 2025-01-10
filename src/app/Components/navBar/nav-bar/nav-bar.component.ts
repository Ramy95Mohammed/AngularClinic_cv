
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { ImportsModule } from '../../../app/imports';
import { LocalizeService } from '../../../services/localize/localize.service';
import { AccountService } from '../../../services/account/account.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Sidebar } from 'primeng/sidebar';
import { SlideBarComponent } from '../../slideBar/slide-bar/slide-bar.component';
import { Router } from '@angular/router'
import { AppComponent } from '../../../app.component';
import { Menubar } from 'primeng/menubar';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [ImportsModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})

export class NavBarComponent implements OnInit {
  items: MenuItem[] | undefined;
  localizeServ: LocalizeService;
  isSignedIn: boolean = false;
  @ViewChild('opLanguage') opLanguage!: OverlayPanel;
  @ViewChild('opUser') opUser!: OverlayPanel;
  _localStorage: Storage | undefined;

  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  @ViewChild('menuBar') menuBar!: Menubar;
  sidebarVisible: boolean = true;
  @Input() dir: string = ''

  constructor(private _localizeServ: LocalizeService, private _accounService: AccountService, private router: Router, private _appComponent: AppComponent) {

    this.localizeServ = _localizeServ;
    _accounService.currentUser.subscribe(() => {
      if (_accounService.currentUser.getValue() != null) {
        this.isSignedIn = true;
      }
      else {
        this.isSignedIn = false;
      }
    });
  }

  languages = [
    { name: 'lbl_arabic', image: 'saudi_arabia_50px.png', lang: 'ar-EG' },
    { name: 'lbl_english', image: 'usa_50px.png', lang: 'en-US' },
    { name: 'lbl_french', image: 'france_50px.png', lang: 'fr-FR' }
  ];


  ngOnInit() {
    this.addMenuBarItems();
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined')
    this._localStorage = localStorage;
  }

  addMenuBarItems() {
    this.items = [
      {
        label: 'lbl_homePage',
        icon: 'pi pi-home',
        route: 'app-home'
      },
      {
        label: 'lbl_mainData',
        icon: 'fa-solid fa-list-check',
        items: [
          {
            label: 'lbl_enterpriseInfo',
            icon: 'fa-solid fa-house-medical-circle-exclamation',
            route: 'app-enterprise-info'
          },
          {
            label: 'lbl_doctors',
            icon: 'fa-solid fa-user-doctor',
            route: 'app-doctor'
          },
          {
            label: 'lbl_sections',
            icon: 'pi pi-th-large',
            items: [
              {
                label: 'lbl_showSections',
                icon: 'fa-solid fa-arrows-to-eye',
                route: "app-section"
              }
            ]
          }
        ]
      },
      {
        label: 'lbl_users',
        icon: 'pi pi-users',
        items: [

          {
            label: 'lbl_permissions',
            icon: 'fa-brands fa-squarespace',
            items: [
              {
                label: 'lbl_specifyPermissions',
                icon: 'fa-brands fa-speaker-deck',
                route: "app-specify-permissions"
              },
              {
                label: 'lbl_usersActions',
                icon: 'fa-brands fa-artstation',
                route: "app-users-action"
              }
            ]
          }
        ]
      },
      {
        label: 'Contact',
        icon: 'pi pi-envelope',
        badge: '3'
      }
      ,
      {
        label: 'lbl_language',
        icon: 'pi pi-language',
        badge: '', 
      }
    ];
  }
  exexuteLogOut() {
    this._accounService.logOut();
    // this._Lang.displayName="";
    // this._Lang.userImage="/assets/images/19supplier_50px.png";
    // localStorage.removeItem('userDisplayName');
    // localStorage.removeItem('userImage');
  }
  onItemClick(event: MenuItemCommandEvent) {
       
  }
  showLanguagePanel(label: string, event: MouseEvent) {
    if (label == 'lbl_language')
    {
      this.opLanguage.toggle(event);
      this.menuBar.toggle(event);
    }
  }

  setLocalizeData(strLang: string) {
    localStorage.setItem('userLanguage', strLang);
    //window.location.reload();
    this._appComponent.getLocalizeData();
    this.opLanguage.hide();
    this.reloadComponent();    
  }
  showUserOverlayPanel(event: MouseEvent)
  {
    this.opUser.toggle(event);
  }

  //   getLocalizeData(strLang:string)
  // {
  // try {
  //   //let userLang = localStorage.getItem('userLanguage')??'en-US';

  //  this.localizeServ.getLocalizeData().subscribe((res)=>{
  //     this.localizeServ.localizeData = res.localizedStrings;
  //     this._appComponent.dir = strLang === 'ar-EG' ? 'rtl' : 'ltr';
  //   });

  // } catch (error) {

  //   }

  // }


  reloadComponent() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
  showSlideBar()
  {    
   // this._appSideBar.showSlideBar();
   this._appComponent.sideBarComponent.showSlideBar();
  }
}
