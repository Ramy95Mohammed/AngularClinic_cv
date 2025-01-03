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
import { AbstractControl, FormArray, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [ImportsModule, CustomNewBtnComponent, CustomPrintBtnComponent, CustomClearBtnComponent, CustomSearchFilterInputComponent, CustomDeleteBtnComponent, CustomEditBtnComponent, CustomPaginatorFilterSearchComponent, CustomDialogComponent, CustomConfirmDialogComponent],
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.scss'
})
export class DoctorComponent implements OnInit {
  ControllerName: string = 'Doctor';
  _localizeServe: LocalizeService;
  printAll: boolean = false;
  doctorsDialog: boolean = false;
  doctors: any[] = [];
  txtSearch: string = '';
  totalRecords: number = 10;
  doctorAppointments: any[] = [];
  weekDays: any[] = [];
  availableStatusData: any[] = [];
  doctorsPriceList: any[] = [];
  styleCls: string = '';
  activeIndex: number = 0;
  doctorAppToDelete: any | null = null;
  doctorAppIndexToDelete: number | null = null;
  doctor: any;
  submitted = false;
  doctorAppointmentTimeIndexToDelete: number | null = null;
  @ViewChild('doctorCustomDialog') doctorCustomDialog!: CustomDialogComponent;
  @ViewChild('customDoctorAppointmentDialog') customDoctorAppointmentDialog!: CustomConfirmDialogComponent;
  @ViewChild('doctorAppointmentsDt') doctorAppointmentsDt!: Table;
  doctorForm:FormGroup;
  doctorPriceFormArray:FormArray;
   doctorAppointmentsFormArray:FormArray;
   //doctorAppointmentTimesFormArray:FormArray;
  _appComp: AppComponent;
  expandedRows = {};
weekDayControl:any;
  constructor(localizeServ: LocalizeService, private messageService: MessageService, private titleService: Title, private _printServ: PrintService, private sharedDataServ: SharedDataService,
    private changeDetectorRef: ChangeDetectorRef, appComp: AppComponent) {
    this._localizeServe = localizeServ;
    this._appComp = appComp;

    //  this.styleCls='d-inline-flex ';
    //  this.styleCls+= _appComp.dir=='ltr'? ' float-start':' float-end';   
    
    this.doctorForm = this.initDoctorForm(null);

    this.doctorPriceFormArray = this.inintDoctorPriceFormArr();


    this.doctorAppointmentsFormArray = this.initDoctorAppointmentsFormArr();
  
    
  }
  ngOnInit(): void {
    let title = this._localizeServe.getLabelValue('lbl_doctors');
    if (title != '')
      this.titleService.setTitle(title);
    //this.initDoctor(null);
    
    this.getAvailableStatusData();
    this.getWeekDaysData();
    
  }

  initDoctorForm(doc:any):FormGroup
  {
    return new FormGroup({
      keyId: new FormControl(doc?.keyId ?? 0  , Validators.required),
      name:new FormControl(doc?.name ?? '' ,[Validators.required, Validators.pattern("^(?!\\s+$).+")] ),
      foreignName:new FormControl(doc?.foreignName ?? '' ,[Validators.required, Validators.pattern("^(?!\\s+$).+")] ),
      phone:new FormControl(doc?.phone ?? '' ,[Validators.required]) ,
      doctorPriceLists:new FormArray([]),
      doctorAppointments:new FormArray([])
    });
  }

  initDoctor(doc: any) {
    this.doctor = {
      keyId: doc?.keyId ?? 0,
      name: doc?.name ?? null,
      foreignName: doc?.foreignName ?? null,
      phone: doc?.phone ?? null,
      doctorPriceLists: [],
      doctorAppointments: []
    };
  }
  
  inintDoctorPriceFormArr():FormArray<any>
  {
    return this.doctorForm.get('doctorPriceLists') as FormArray;
  }
  get getDoctrorPriceFormControl():any
  {
     return this.doctorPriceFormArray.controls;
  }

  
    initDoctorPriceFormGroup(price:any):FormGroup
    {
      return new FormGroup({
        keyId:new FormControl(price?.keyId??0 , Validators.required),
        price:new FormControl(price?.price??1 , Validators.required),
        doctorId:new FormControl(price?.doctorId??0 , Validators.required)
    })
  }


  initDoctorAppointmentsFormArr():FormArray<any>
  {
    return this.doctorForm.get('doctorAppointments') as FormArray;
  }
  initDoctorAppointmentsFormGruoup(doctorApp:any ,day:any):FormGroup
  {
   return new FormGroup({
    keyId: new FormControl(doctorApp?.keyId ?? 0 , Validators.required),
    weekDay: new FormControl(doctorApp?.weekDay??day , Validators.required ),
    availableStatus: new FormControl(doctorApp?.availableStatus ?? 0  ),
    doctorId:new FormControl(doctorApp?.doctorId ?? 0),
    doctorAppointmentTimes:new FormArray([
     
    ])
   });
  }
get getDoctorAppointmentsFormControls():any
{
  return this.doctorAppointmentsFormArray.controls;
}


initdoctorAppointmentTimesFormArr():FormArray<any>
  {
    return this.doctorForm.get('doctorAppointments')?.get('doctorAppointmentTimes') as FormArray;
  }

  inintDoctorAppointmentTimesFromGroup(time:any):FormGroup
  {
   return new FormGroup({
      keyId: new FormControl(time?.keyId??0 , Validators.required),
      appointment:new FormControl(time?.appointment??null ,[Validators.required, Validators.pattern("^(?!\\s+$).+")]),
      availableStatus:new FormControl(time?.availableStatus??0),        
    })
  }
  openNew() {
    //    this.sectionForm = this.initsectionForm(null);

    this.doctorsPriceList = [];
  
    this.doctorPriceFormArray.push(this.initDoctorPriceFormGroup(null));
    this.doctorAppointmentsFormArray.clear();
    this.setDoctorAppointmentsData(null);
    //this.expandAll();
    this.showDialog('lbl_addDoctor', true);
  }

  getWeekDaysData() {
    this.sharedDataServ.getweekDaysData().subscribe((res) => {
      this.weekDays = res;
    });
  }

  setDoctorAppointmentsData(doctorApp: any) {
    this.weekDays.forEach(d => {

      this.doctorAppointmentsFormArray.push(this.initDoctorAppointmentsFormGruoup(doctorApp , d.key));
      
    });
  }
  getAvailableStatusData() {
    this.sharedDataServ.getAvailableStatusData().subscribe((res) => {
      this.availableStatusData = res;
    });
  }
  getExpandableIcon(expanded: any): string {
    let str = expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-' + (this._appComp.dir == 'ltr' ? 'right' : 'left');
    return str;
  }
  getWeekDayName(weekDay: number): string {
    
    return this.weekDays.find(w => w.key == weekDay).value;
  }
  showDialog(dialogHeader: string, saveOrEdit: boolean = true) {
    this.doctorCustomDialog.header = this._localizeServe.getLabelValue(dialogHeader);
    this.doctorCustomDialog.saveOrEdit = saveOrEdit;
    this.doctorsDialog = true;
  }
  addTimeToWeekDay(doctorApp: FormGroup) {
    if( doctorApp?.get('doctorAppointmentTimes') != null)
    {
      let doctorAppointmentTimesArr: FormArray = doctorApp?.get('doctorAppointmentTimes') as FormArray ;

      doctorAppointmentTimesArr.push(this.inintDoctorAppointmentTimesFromGroup(null));
    }

    // let _doctorAppointmentTimes: any[] = doctorApp?.doctorAppointmentTimes;
    // if (doctorApp.keyId == 0) {
    //   doctorApp?.doctorAppointmentTimes.push({

    //     keyId: 0,
    //     appointment: new Date(),
    //     availableStatus: 0,
    //     isDeleted: false
    //   });

    // }
    // else
    //   _doctorAppointmentTimes.forEach(time => {
    //     _doctorAppointmentTimes.push({

    //       keyId: time?.keyId ?? 0,
    //       appointment: time?.appointment ?? new Date(),
    //       availableStatus: time?.availableStatus ?? 0,
    //       isDeleted: false
    //     });
    //   });

    // this.changeDetectorRef.detectChanges();
  }
  addNewPrice() {
   
    this.doctorPriceFormArray.push(this.initDoctorPriceFormGroup(null));
  }
  calculateCustomerTotal(doctorApp: any) {
    let total = 0;
    let _doctorAppointmentTimes: any[] = doctorApp.doctorAppointmentTimes;
    total = _doctorAppointmentTimes.length;

    return total;
  }
  getPaginatedData() { }
  showConfirmDialog(keyId: number) {

  }
  getDoctorForEdit(keyId: number) {

  }
  onSave() {
    if(!this.doctorForm.valid)
    this.doctorForm.markAllAsTouched();
   }
  onEdit() { }
  onDelete() { }
  showDoctorAppointmentTimeDialog(doctorApp: any, rowIndex: number, i: number) {
    this.doctorAppToDelete = doctorApp;
    this.doctorAppIndexToDelete = rowIndex;
    this.doctorAppointmentTimeIndexToDelete = i;
    this.customDoctorAppointmentDialog.showDialog('lbl_sureToDelete', 'lbl_confirm', 'lbl_yes', 'lbl_no');
  }
  deleteDoctorAppointmentTime() {
  
    if (this.doctorAppToDelete != null && this.doctorAppIndexToDelete != null && this.doctorAppointmentTimeIndexToDelete != null) {

      if(     this.doctorAppToDelete?.get('doctorAppointmentTimes') != null)
      {
        let doctorAppointmentTimesArr: FormArray =     this.doctorAppToDelete?.get('doctorAppointmentTimes') as FormArray ;
  
        doctorAppointmentTimesArr.removeAt( this.doctorAppointmentTimeIndexToDelete!);
      }

      // (this.doctorAppointments.at(this.doctorAppIndexToDelete)?.doctorAppointmentTimes as any[]).splice(this.doctorAppointmentTimeIndexToDelete, 1);
      this.doctorAppToDelete = null;
      this.doctorAppIndexToDelete = null;
      this.doctorAppointmentTimeIndexToDelete = null;
      
    }
  }
  test(form: NgForm) {
    //this.submitted = true;
  this.markFormAsTouched(form);
    //console.log(form.valid);
  }
  markFormAsTouched(form: NgForm) {
    // Mark master section fields as touched

    Object.values(form.controls).forEach(control => control.markAsTouched());
    
    // Mark detail section fields as touched (iterate over each detail row)
    // this.doctorAppointments.forEach((detail, index) => {
    //   // You may need to access each row's controls using their index (like itemName, quantity, price, etc.)
    //   const controls = form.controls[`appointment${index}`];
    //   controls?.markAsTouched();
    //   console.log(controls.valid);
    //   // const quantity = form.controls[`quantity${index}`];
    //   // quantity?.markAsTouched();
    //   // const price = form.controls[`price${index}`];
    //   // price?.markAsTouched();
    //});
  }


  
}
