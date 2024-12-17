import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';
import { LocalizeService } from '../../../services/localize/localize.service';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { ImportsModule } from '../../../app/imports';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ImportsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})


export class HomeComponent implements OnInit {
themeItems:any;
  _localizeServ:LocalizeService;
  sidebarVisible:boolean = false;
  valuee: string | undefined;


  constructor(private themeSerivce:ThemeService , private localizeServ:LocalizeService , private titleService:Title)
  {
   this._localizeServ = localizeServ; 

   this.themeItems=[
    {id:0,theme:'aura-dark-noir'}
    ,{id:1 , theme: 'viva-dark' },
    {id:2 , theme:'lara-dark-green'},
    {id:3 , theme:'nano'},
    {id:4 , theme:'saga-blue'},
    {id:5 , theme:'arya-orange'},
    {id:6 , theme:'arya-purple'},
    {id:7 , theme:'aura-dark-amber'},
    {id:8 , theme:'aura-dark-pink'},
    {id:9 , theme:'lara-light-cyan'},
    {id:10 , theme:'lara-dark-pink'},
    {id:11 , theme:'nova-accent'},
    {id:12 , theme:'rhea'},
    {id:13 , theme:'mira'},
    {id:14 , theme:'soho-dark'},
    {id:15 , theme:'vela-green'},
    {id:16 , theme:'fluent-light'},
    {id:17 , theme:'lara-dark-teal'},
    {id:18 , theme:'bootstrap4-dark-purple'},
    {id:19 , theme:'luna-blue'},
    {id:20 , theme:'vela-orange'},
    {id:21 , theme:'mdc-light-deeppurple'},
    {id:22 , theme:'md-dark-deeppurple'},
    {id:23 , theme:'lara-light-green'},
    {id:24 , theme:'aura-light-green'},
    {id:25 , theme:'arya-green'},
    {id:26 , theme:'saga-green'},
    {id:27 , theme:'luna-green'},
    {id:28 , theme:'vela-blue'},
    {id:29 , theme:'nova-alt'},
  ];
  }
  ngOnInit(): void {
    //this.hideP_PanelHeader();
    let title=this._localizeServ.getLabelValue('lbl_homePage');
    if( title !='')
    this.titleService.setTitle(title );
  }
  changeTheme(theme:string)
  {
    this.themeSerivce.switchTheme(theme);
  } 
 changeThemeByDropDown(e:DropdownChangeEvent)
 {
   this.changeTheme(e.value);
 }

}
