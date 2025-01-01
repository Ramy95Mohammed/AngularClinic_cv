import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { LocalizeService } from '../../../../services/localize/localize.service';
import { PrintService } from '../../../../services/printingservice/print.service';
import { Title } from '@angular/platform-browser';
import { ImportsModule } from '../../../../app/imports';
import { CustomNewBtnComponent } from "../../../customComponents/customNewBtn/custom-new-btn/custom-new-btn.component";
import { CustomPrintBtnComponent } from "../../../customComponents/customPrintBtn/custom-print-btn/custom-print-btn.component";
import { CustomClearBtnComponent } from "../../../customComponents/customClearBtn/custom-clear-btn/custom-clear-btn.component";
import { CustomSearchFilterInputComponent } from "../../../customComponents/customSearchFilterInput/custom-search-filter-input/custom-search-filter-input.component";
import { CustomDeleteBtnComponent } from "../../../customComponents/customDeleteBtn/custom-delete-btn/custom-delete-btn.component";
import { CustomEditBtnComponent } from "../../../customComponents/customEditBtn/custom-edit-btn/custom-edit-btn.component";
import { CustomPaginatorFilterSearchComponent } from "../../../customComponents/customPaginatorFilterSearch/custom-paginator-filter-search/custom-paginator-filter-search.component";
import { CustomDialogComponent } from "../../../customComponents/customDialogComponent/custom-dialog/custom-dialog.component";
import { CustomConfirmDialogComponent } from "../../../customComponents/customConfirmDialogComponent/custom-confirm-dialog/custom-confirm-dialog.component";
import { SharedDataService } from '../../../../services/sharedData/shared-data.service';
import { Table } from 'primeng/table';
import { AppComponent } from '../../../../app.component';

@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [ImportsModule, CustomNewBtnComponent, CustomPrintBtnComponent, CustomClearBtnComponent, CustomSearchFilterInputComponent, CustomDeleteBtnComponent, CustomEditBtnComponent, CustomPaginatorFilterSearchComponent, CustomDialogComponent, CustomConfirmDialogComponent],
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.scss'
})
export class DoctorComponent implements OnInit{
  ControllerName: string = 'Doctor';
  _localizeServe: LocalizeService;
  printAll:boolean = false;
  doctorsDialog:boolean = false;
  doctors:any[]=[];
  txtSearch:string='';
  totalRecords:number=10;
  doctorAppointments:any[]=[];
  weekDays:any[]=[];
  availableStatusData:any[]=[];
  styleCls:string = '';
  @ViewChild('doctorCustomDialog') doctorCustomDialog!:CustomDialogComponent;
  @ViewChild('doctorAppointmentsDt') doctorAppointmentsDt!:Table;
  _appComp:AppComponent;
  
  constructor(localizeServ: LocalizeService , private messageService: MessageService,private titleService: Title, private _printServ: PrintService ,private sharedDataServ: SharedDataService ,
    private changeDetectorRef: ChangeDetectorRef , appComp:AppComponent)
  {
     this._localizeServe = localizeServ;
   this._appComp = appComp;

    //  this.styleCls='d-inline-flex ';
    //  this.styleCls+= _appComp.dir=='ltr'? ' float-start':' float-end';     
     
  }
  ngOnInit(): void {
    let title = this._localizeServe.getLabelValue('lbl_doctors');
    if (title != '')
      this.titleService.setTitle(title);

      this. getWeekDaysData();
    this.getAvailableStatusData();    
  }

  
  openNew() {
//    this.sectionForm = this.initsectionForm(null);
    this.showDialog('lbl_addDoctor', true);
  }

  getWeekDaysData()
  {
    this.sharedDataServ.getweekDaysData().subscribe((res)=>{
      this.weekDays = res;   
      this.setDoctorAppointmentsData();   
    });
  }

 setDoctorAppointmentsData()
 {
  this.weekDays.forEach(d=>{
    let doctorApp={
      weekDay:d.key,
      availableStatus:0,
      doctorAppointmentTimes:[{
        appointment:new Date(),
        availableStatus:0,
        isDeleted:false
      }]
    };
  
    this.doctorAppointments.push(doctorApp);
  });
 }
getAvailableStatusData()
{
  this.sharedDataServ.getAvailableStatusData().subscribe((res)=>{
    this.availableStatusData = res;
  });
}
getExpandableIcon(expanded:any):string
{
  let str= expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-'+(this._appComp.dir == 'ltr'?'right':'left');
  return str;
}
 getWeekDayName(weekDay:number):string
 {
  return this.weekDays.find(w=>w.key == weekDay).value;
 }
  showDialog(dialogHeader: string, saveOrEdit: boolean = true) {
    this.doctorCustomDialog.header = this._localizeServe.getLabelValue(dialogHeader);
    this.doctorCustomDialog.saveOrEdit = saveOrEdit;
    this.doctorsDialog = true;
  }
  addTimeToWeekDay(doctorApp:any)
  {
    
    doctorApp.doctorAppointmentTimes.push({
      appointment:new Date(),
      availableStatus:0,
      isDeleted:false
    });
    this.changeDetectorRef.detectChanges();
  }

  calculateCustomerTotal(doctorApp: any) {
    let total = 0;
let _doctorAppointmentTimes :any[]= doctorApp.doctorAppointmentTimes;
    total=  _doctorAppointmentTimes.filter(d=>!d.isDeleted).length;

    return total;
}
  getPaginatedData()
  {}
  showConfirmDialog(keyId:number)
  {

  }
  getDoctorForEdit(keyId:number)
  {

  }
  onSave()
  {}
  onEdit()
  {}
  onDelete()
  {}
  
}
