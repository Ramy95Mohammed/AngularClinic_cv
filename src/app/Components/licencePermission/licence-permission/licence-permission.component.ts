import { Component, OnInit } from '@angular/core';
import { LocalizeService } from '../../../services/localize/localize.service';
import { TimelineModule } from 'primeng/timeline';
import { ActivatedRoute } from '@angular/router';
import { ImportsModule } from '../../../app/imports';


interface EventItem {
  status?: string;
  date?: any;
  icon?: string;
  color?: string;
  image?: string;
}
  
@Component({
  selector: 'app-licence-permission',
  standalone: true,
  imports: [ImportsModule],
  templateUrl: './licence-permission.component.html',
  styleUrl: './licence-permission.component.scss'
})
export class LicencePermissionComponent implements OnInit{
  _localizeServ:LocalizeService;
  licenseData:any = {};
  
  events: EventItem[];
  constructor(private localizeServ:LocalizeService,private route: ActivatedRoute)
  {
    this._localizeServ = localizeServ;
    this.events =[];
  
    
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params=>{
      this.licenseData = params;      
    });
    this.events = [
      { status: 'lbl_licenseActivationDate', date: this.licenseData.createDateTime, icon: 'pi pi-shopping-cart', color: '#9C27B0', image: 'game-controller.jpg' },
      { status: 'lbl_licenseExpirationDate', date: this.licenseData.expiredDateTime, icon: 'pi pi-cog', color: '#673AB7' },
     
  ];  
  }
}
