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
import { DoctorService } from '../../../../services/mainData/doctors/doctor.service';

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
  doctorPriceRowIndexToDelete: number | null = null;
  doctor: any;
  submitted = false;
  @ViewChild('doctorCustomDialog') doctorCustomDialog!: CustomDialogComponent;
  @ViewChild('customDeleteDialog') customDeleteDialog!: CustomConfirmDialogComponent;
  @ViewChild('customDoctorAppointmentDialog') customDoctorAppointmentDialog!: CustomConfirmDialogComponent;
  @ViewChild('customDoctorPricesDialog') customDoctorPricesDialog!: CustomConfirmDialogComponent;
  @ViewChild('doctorAppointmentsDt') doctorAppointmentsDt!: Table;
  doctorForm:FormGroup;
  doctorPriceFormArray:FormArray;
   doctorAppointmentsFormArray:FormArray;
   //products:any[]=[];

   typeOfMedicalExaminationData:any[]=[];
  _appComp: AppComponent;
  expandedRows = {};
weekDayControl:any;
  constructor(localizeServ: LocalizeService, private messageService: MessageService, private titleService: Title, private _printServ: PrintService, private sharedDataServ: SharedDataService,
    private changeDetectorRef: ChangeDetectorRef, appComp: AppComponent , private _doctorServ:DoctorService) {
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
    this.getTypeOfMedicalExaminationData();

    // this.products.push(
    //   {
    //     id: '1000',
    //     code: 'f230fh0g3',
    //     name: 'Bamboo Watch',
    //     description: 'Product Description',
    //     image: 'bamboo-watch.jpg',
    //     price: 65,
    //     category: 'Accessories',
    //     quantity: 24,
    //     inventoryStatus: 'INSTOCK',
    //     rating: 5
    // }
    // );
  }
   

   //#region InitDoctorForms
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
        doctorId:new FormControl(price?.doctorId??0 , Validators.required),
        typeOfMedicalExamination: new FormControl(price?.typeOfMedicalExamination , Validators.required),        
        notes:new FormControl(price?.notes??''),      
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
      appointment:new FormControl(time?.appointment??new Date() ,[Validators.required, Validators.pattern("^(?!\\s+$).+")]),
      availableStatus:new FormControl(time?.availableStatus??0),                
    })
  }

  // inintDoctorAppointmentTimesFromGroup(time: any): FormGroup {
  //   // Convert the appointment field to the required hh:mm:ss a format
  //   let formattedAppointment: string;
  
  //   if (time?.appointment) {
  //     // If the appointment is a valid Date string or Date object, format it
  //     const date = new Date(time.appointment);
  //     const hours = date.getHours();
  //     const minutes = date.getMinutes();
  //     const seconds = date.getSeconds();
  //     const ampm = hours >= 12 ? 'PM' : 'AM';
      
  //     // Convert hours to 12-hour format
  //     const formattedHour = (hours % 12 || 12).toString().padStart(2, '0');
  //     const formattedMinute = minutes.toString().padStart(2, '0');
  //     const formattedSecond = seconds.toString().padStart(2, '0');
      
  //     // Construct the formatted appointment time
  //     formattedAppointment = `${formattedHour}:${formattedMinute}:${formattedSecond} ${ampm}`;
  //   } else {
  //     // Default value if appointment is not provided
  //     formattedAppointment = new Date().toLocaleTimeString();
  //   }
  
  //   return new FormGroup({
  //     keyId: new FormControl(time?.keyId ?? 0, Validators.required),
  //     appointment: new FormControl(formattedAppointment, [Validators.required, Validators.pattern("^(?!\\s+$).+")]),
  //     availableStatus: new FormControl(time?.availableStatus ?? 0),
  //   });
  // }

  //#endregion



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
  getTypeOfMedicalExaminationData()
  {
    this.sharedDataServ.getTypeOfMedicalExaminationData().subscribe((res)=>{
      this.typeOfMedicalExaminationData = res;
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
    if(this.doctorForm.valid)
    {
       this._doctorServ.saveDoctorData(this.doctorForm.value).subscribe((res)=>{
        this.messageService.add({
          severity: 'success', summary: this._localizeServe.getLabelValue('lbl_success')
          , detail: this._localizeServe.getLabelValue('lbl_missionCompletedSuccessfully')
        });
       });
    }
    else
    {
      this.doctorForm.markAllAsTouched();
          this.customDeleteDialog.showDialog('lbl_someEntriesAreMissingOrIncorrect', 'lbl_warning', 'lbl_Ok', 'lbl_Ok' ,false);
    }
   }
  onEdit() { }
  onDelete() { }
  showDoctorAppointmentTimeDialog(doctorApp: any, rowIndex: number) {
    this.doctorAppToDelete = doctorApp;
    this.doctorAppIndexToDelete = rowIndex;
    
    this.customDoctorAppointmentDialog.showDialog('lbl_sureToDelete', 'lbl_confirm', 'lbl_yes', 'lbl_no');
  }
  deleteDoctorAppointmentTime() {
  
    if (this.doctorAppToDelete != null && this.doctorAppIndexToDelete != null) {

      if(     this.doctorAppToDelete?.get('doctorAppointmentTimes') != null)
      {
        let doctorAppointmentTimesArr: FormArray = this.doctorAppToDelete?.get('doctorAppointmentTimes') as FormArray ;
  
        doctorAppointmentTimesArr.removeAt( this.doctorAppIndexToDelete!);
      }

      // (this.doctorAppointments.at(this.doctorAppIndexToDelete)?.doctorAppointmentTimes as any[]).splice(this.doctorAppointmentTimeIndexToDelete, 1);
      this.doctorAppToDelete = null;
      this.doctorAppIndexToDelete = null;
      
      
    }
  }

  showPricesConfirmDialog(rowIndex:number)
  {
    this.doctorPriceRowIndexToDelete = rowIndex; 
    this.customDoctorPricesDialog.showDialog('lbl_sureToDelete', 'lbl_confirm', 'lbl_yes', 'lbl_no');   
  }
  deletePriceFromPricesFormArray()
  {
    if(this.doctorPriceRowIndexToDelete != null)
    {
      this.doctorPriceFormArray.removeAt(this.doctorPriceRowIndexToDelete);
      this.doctorPriceRowIndexToDelete = null;
    }
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
getTypeOfMedicalExaminationValue(key:number)
{
  return this.typeOfMedicalExaminationData.find(t=>t.key == key)?.value??this._localizeServe.getLabelValue('lbl_choose');
}
getAppointmentTimeFormat(time:FormGroup)
{
  // Get the time value
const appointmentTime = time.get('appointment')?.value;

if (appointmentTime) {
    
    const date = new Date(appointmentTime);

    
    const formattedTime = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true, 
    }).format(date);

   return formattedTime;  
}
return null;
}
  getAvailableStatusValue(key:number)
  {
    return  this.availableStatusData.find(a=>a.key == key).value??'';
  }

  getWeekDaysValue(key:number)
  {
    return  this.weekDays.find(a=>a.key == key).value??'';
  }
}
