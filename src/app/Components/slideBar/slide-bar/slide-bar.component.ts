import { Component, ViewChild, OnInit, Input, AfterViewInit } from '@angular/core';
import { Sidebar, SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ImportsModule } from '../../../app/imports';
import { LocalizeService } from '../../../services/localize/localize.service';
import { Router } from '@angular/router';




@Component({
  selector: 'app-slide-bar',
  standalone: true,
  imports: [ImportsModule],
  templateUrl: './slide-bar.component.html',
  styleUrl: './slide-bar.component.scss'
})
export class SlideBarComponent implements OnInit, AfterViewInit {
  _localStorage: Storage | undefined;
  _localizeServ: LocalizeService;
  
  constructor(localizeServ: LocalizeService,private router: Router) {
    this._localizeServ = localizeServ;
  
  }
  ngAfterViewInit(): void {

  }
  ngOnInit(): void {
    if (this.sidebarVisible) {

    }
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined')
      this._localStorage = localStorage;

  }
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  sidebarVisible: boolean = true;
  @Input() dir: string = ''

  closeCallback(e: any): void {
    this.sidebarRef.close(e);
  }

  showSlideBar() {
    setTimeout(() => {
      
      this.sidebarVisible = true
    }, 300);

    const sidebar: any = document.getElementById('appSidebar');
      
    const element:any = document.getElementById('bodyContents');
    element.style.transition = 'width 0.3s ease-in-out';
      if (element?.classList.contains('col-md-12')) {
        element?.classList.remove('col-md-12');
        element?.classList.add('col-md-10');
      }

  }

  makeBodyContentsFullScree() {
    const sidebar: any = document.getElementById('appSidebar');

    const element:any = document.getElementById('bodyContents');
    element.style.transition = 'width 0.3s ease-in-out';
      if (element?.classList.contains('col-md-10')) {
        element?.classList.remove('col-md-10');
        element?.classList.add('col-md-12');
      }
  
  }

  navigateToUrlWithParams(route:string,queryParams:{}|null)
  {
    
    this.router.navigate([route],{ queryParams: queryParams});
  }
}
