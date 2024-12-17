
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { ImportsModule } from '../../../app/imports';
import { LocalizeService } from '../../../services/localize/localize.service';
import { AccountService } from '../../../services/account/account.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Sidebar } from 'primeng/sidebar';
import { SlideBarComponent } from '../../slideBar/slide-bar/slide-bar.component';
import { Router } from '@angular/router'

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [ImportsModule],
templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})

export class NavBarComponent implements OnInit {
  items: MenuItem[] | undefined;
  localizeServ:LocalizeService;
  isSignedIn:boolean=false;
  @ViewChild('op') op!: OverlayPanel;


  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  sidebarVisible:boolean = true;
 @Input() dir: string = ''

  constructor(private _localizeServ:LocalizeService, private _accounService:AccountService,private router: Router)
  {

this.localizeServ = _localizeServ;
_accounService.currentUser.subscribe(()=>{
    if(_accounService.currentUser.getValue() != null)
    {
      this.isSignedIn = true;
    }
    else
    {
      this.isSignedIn = false;
    }
  }); 
  }

  languages = [
    { name: 'lbl_arabic', image: 'saudi_arabia_50px.png' , lang:'ar-EG'},
    { name: 'lbl_english', image: 'usa_50px.png' , lang:'en-US' },
    { name: 'lbl_french', image: 'france_50px.png' , lang:'fr-FR'}
];


  ngOnInit() {
    this.addMenuBarItems();
  }

  addMenuBarItems()
{
    this.items = [
        {
            label: 'lbl_homePage',
            icon: 'pi pi-home',
            route:'app-home'
        },        
        {
            label: 'lbl_mainData',
            icon: 'fa-solid fa-list-check',
            items: [
                
                {
                    label: 'lbl_sections',
                    icon: 'pi pi-th-large',
                    items: [
                        {
                            label: 'lbl_showSections',
                            icon: 'fa-solid fa-arrows-to-eye',
                            route:"app-section"
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
                            route:"app-specify-permissions"
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
            command:(event)=>{ this.onItemClick(event);}
        }
    ];
}
exexuteLogOut()
  {
    this._accounService.logOut();    
    // this._Lang.displayName="";
    // this._Lang.userImage="/assets/images/19supplier_50px.png";
    // localStorage.removeItem('userDisplayName');
    // localStorage.removeItem('userImage');
  }
  onItemClick(event: MenuItemCommandEvent) {
    event.originalEvent?.preventDefault();
  }
  showLanguagePanel(label:string , event:any)
  {
    if(label =='lbl_language')
    this.op.toggle(event);
  }

  async setLocalizeData(strLang:string)
  {  
    localStorage.setItem('userLanguage' , strLang);
      window.location.reload();
    // this.getLocalizeData();
   //await this.reloadComponent() ;
  }

  
//             async  getLocalizeData()
//             {
//             try {
//               let userLang = localStorage.getItem('userLanguage')??'en-US';
              
//               const data = await this.localizeServ.getLocalizeData().toPromise();
//               this.localizeServ.localizeData = data.localizedStrings;
//               this.dir =userLang === 'ar-EG' ? 'rtl' : 'ltr';
//             } catch (error) {
              
//               }

//             }


//  reloadComponent() {
//    const currentUrl = this.router.url;
//     this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => { this.router.navigate([currentUrl]);
//      });
// }
}
