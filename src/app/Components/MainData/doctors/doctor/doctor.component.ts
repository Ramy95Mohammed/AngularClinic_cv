import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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
import { HelperService } from '../../../../services/helper.service';
import { HttpHeaders } from '@angular/common/http';
import { Dropdown, DropdownChangeEvent } from 'primeng/dropdown';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [ImportsModule, CustomNewBtnComponent, CustomPrintBtnComponent, CustomClearBtnComponent, CustomSearchFilterInputComponent, CustomDeleteBtnComponent, CustomEditBtnComponent, CustomPaginatorFilterSearchComponent, CustomDialogComponent, CustomConfirmDialogComponent],
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.scss'
})
export class DoctorComponent implements OnInit ,AfterViewInit{
  ControllerName: string = 'Doctor';
  _localizeServe: LocalizeService;
  printAll: boolean = false;
  doctorsDialog: boolean = false;
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
  doctorKeyIdToDelete: number | null = null;
  doctor: any;
  submitted = false;
  genderData: any[] = [];
  adminUsersData: any[] = [];
  uploadedFiles: any[] = [];
  downloadedFiles: any[] = [];
  doctorImagefileNameToDelete: string | null = null;
  academicDegreeData: any[] = [];
  doctorsData: any[] = [];
  doctorsTxtSearch: string = '';
  @ViewChild('doctorCustomDialog') doctorCustomDialog!: CustomDialogComponent;
  @ViewChild('customDeleteDialog') customDeleteDialog!: CustomConfirmDialogComponent;
  @ViewChild('customDoctorAppointmentDialog') customDoctorAppointmentDialog!: CustomConfirmDialogComponent;
  @ViewChild('customDoctorPricesDialog') customDoctorPricesDialog!: CustomConfirmDialogComponent;
  @ViewChild('deleteImageConfirmDialog') deleteImageConfirmDialog!: CustomConfirmDialogComponent;
  @ViewChild('adminUsersDropDown') adminUsersDropDown!: Dropdown;
  @ViewChild('paginatorRef') paginatorRef!: CustomPaginatorFilterSearchComponent;
  @ViewChild('txtCustomtxtSearchDoctors') txtCustomtxtSearchDoctors!: CustomSearchFilterInputComponent;
  @ViewChild('doctorAppointmentsDt') doctorAppointmentsDt!: Table;
  doctorForm: FormGroup;
  doctorPriceFormArray: FormArray;
  doctorAppointmentsFormArray: FormArray;


  typeOfMedicalExaminationData: any[] = [];
  _appComp: AppComponent;
  expandedRows = {};
  weekDayControl: any;
  constructor(localizeServ: LocalizeService, private messageService: MessageService, private titleService: Title, private _printServ: PrintService, private sharedDataServ: SharedDataService,
    private cdr: ChangeDetectorRef, appComp: AppComponent, private _doctorServ: DoctorService, private _helperServ: HelperService, private printServ: PrintService,
    private route: ActivatedRoute,private _router:Router) {
    this._localizeServe = localizeServ;
    this._appComp = appComp;



    this.doctorForm = this.initDoctorForm(null);

    this.doctorPriceFormArray = this.inintDoctorPriceFormArr();
    this.doctorAppointmentsFormArray = this.initDoctorAppointmentsFormArr();


  }
  ngAfterViewInit(): void {
    this.openDialogAccordingToOperation();
      this.cdr.detectChanges();
  }
  ngOnInit(): void {
    let title = this._localizeServe.getLabelValue('lbl_showDoctors');
    if (title != '')
      this.titleService.setTitle(title);

    this.getDoctorsData(1, 10, this.doctorsTxtSearch, null);
    this.getAvailableStatusData();
    this.getWeekDaysData();
    this.getTypeOfMedicalExaminationData();
    this.getGendersData();
    this.getAdminUsersData();
    this.sharedDataServ.setSectionsData();
    this.getAcademicDegree();
  }
  get getSectionsData() {
    return this.sharedDataServ.sectionsData;
  }
  openDialogAccordingToOperation() {
    this.route.queryParams.subscribe((params:any) => {

      if(params['operation'] == 'add')
      {
        this.openNew();
        this._router.navigate([]);        
      }
      
    });
  }
  getGendersData() {

    this.sharedDataServ.getGenderData().subscribe((res) => {
      this.genderData = res;
    })
  }

  getAdminUsersData() {
    this.sharedDataServ.getAdminUsersData().subscribe((res) => {
      this.adminUsersData = res;
    });
  }
  getDoctorsData(pageIndex: number, pageSize: number, searchValue: string, sort: string | null) {
    this._doctorServ.getDoctorsData(pageIndex, pageSize, searchValue, sort).subscribe((res) => {
      this.doctorsData = res.data;
      this.totalRecords = res.count;
    });
  }


  getAcademicDegree() {
    this.sharedDataServ.getAcademicDegreeData().subscribe((res) => {
      this.academicDegreeData = res;
    });
  }
  //#region InitDoctorForms
  initDoctorForm(doc: any): FormGroup {
    return new FormGroup({
      //Personal Data
      keyId: new FormControl(doc?.keyId ?? 0, Validators.required),
      name: new FormControl(doc?.name ?? '', [Validators.required, Validators.pattern("^(?!\\s+$).+")]),
      foreignName: new FormControl(doc?.foreignName ?? '', [Validators.required, Validators.pattern("^(?!\\s+$).+")]),
      phone: new FormControl(doc?.phone ?? '', [Validators.required, Validators.pattern("^(?!\\s+$).+")]),
      gender: new FormControl(doc?.gender, Validators.required),
      birthDate: new FormControl(doc?.birthDate != undefined ? new Date(doc?.birthDate) : new Date(1980, 1), Validators.required),
      passportNumber: new FormControl(doc?.passportNumber ?? ''),
      email: new FormControl(doc?.email ?? ''),
      address: new FormControl(doc?.address ?? ''),
      appUserId: new FormControl(doc?.appUserId, Validators.required),
      //Academic and professional qualifications.     
      academicDegree: new FormControl(doc?.academicDegree, Validators.required),
      sectionId: new FormControl(doc?.sectionId, Validators.required),
      subspecialty: new FormControl(doc?.subspecialty ?? ''),
      university: new FormControl(doc?.university ?? '', [Validators.required, Validators.pattern("^(?!\\s+$).+")]),
      graduationYear: new FormControl(doc?.graduationYear != undefined ? new Date(doc?.graduationYear) : null, Validators.required),
      medicalLicensing: new FormControl(doc?.medicalLicensing ?? ''),
      //the language
      languagesSpokenByTheDoctor: new FormControl(doc?.languagesSpokenByTheDoctor ?? ''),
      //Professional experience
      previousExperience: new FormControl(doc?.previousExperience ?? ''),
      numberOfYearsOfExperience: new FormControl(doc?.numberOfYearsOfExperience ?? ''),
      specialMedicalSkills: new FormControl(doc?.specialMedicalSkills ?? ''),
      //Specialized equipment and devices
      equipmentAndDevicesSubspecialties: new FormControl(doc?.equipmentAndDevicesSubspecialties ?? ''),
      medicalInstrumentsOrDevices: new FormControl(doc?.medicalInstrumentsOrDevices ?? ''),
      //Current work information
      currentCliniOrHospital: new FormControl(doc?.currentCliniOrHospital ?? ''),
      jobTitle: new FormControl(doc?.jobTitle ?? ''),
      numberOfWeeklyWorkingHours: new FormControl(doc?.numberOfWeeklyWorkingHours ?? ''),
      workingDays: new FormControl(doc?.workingDays ?? ''),
      workingHours: new FormControl(doc?.workingHours ?? ''),
      currentLocationOfWork: new FormControl(doc?.currentLocationOfWork ?? ''),
      //Medical Insurance Information
      availableMedicalInsurance: new FormControl(doc?.availableMedicalInsurance ?? ''),
      insuranceCardNumber: new FormControl(doc?.insuranceCardNumber ?? ''),

      doctorPriceLists: new FormArray([]),
      doctorAppointments: new FormArray([])
    });
  }


  inintDoctorPriceFormArr(): FormArray<any> {
    return this.doctorForm.get('doctorPriceLists') as FormArray;
  }
  get getDoctrorPriceFormControl(): any {
    return this.doctorPriceFormArray.controls;
  }


  initDoctorPriceFormGroup(price: any): FormGroup {
    return new FormGroup({
      keyId: new FormControl(price?.keyId ?? 0, Validators.required),
      price: new FormControl(price?.price ?? 1, Validators.required),
      doctorId: new FormControl(price?.doctorId ?? 0, Validators.required),
      typeOfMedicalExamination: new FormControl(price?.typeOfMedicalExamination, Validators.required),
      notes: new FormControl(price?.notes ?? ''),
    })
  }


  initDoctorAppointmentsFormArr(): FormArray<any> {
    return this.doctorForm.get('doctorAppointments') as FormArray;
  }
  initDoctorAppointmentsFormGruoup(doctorApp: any, day: any): FormGroup {
    return new FormGroup({
      keyId: new FormControl(doctorApp?.keyId ?? 0, Validators.required),
      weekDay: new FormControl(doctorApp?.weekDay ?? day, Validators.required),
      availableStatus: new FormControl(doctorApp?.availableStatus ?? 0),
      doctorId: new FormControl(doctorApp?.doctorId ?? 0),
      doctorAppointmentTimes: new FormArray([

      ])
    });
  }
  get getDoctorAppointmentsFormControls(): any {
    return this.doctorAppointmentsFormArray.controls;
  }


  initdoctorAppointmentTimesFormArr(): FormArray<any> {
    return this.doctorForm.get('doctorAppointments')?.get('doctorAppointmentTimes') as FormArray;
  }

  inintDoctorAppointmentTimesFromGroup(time: any): FormGroup {
    return new FormGroup({
      keyId: new FormControl(time?.keyId ?? 0, Validators.required),
      appointment: new FormControl(time?.appointment ? new Date(new Date(time?.appointment).toLocaleString()) : new Date(), [Validators.required, Validators.pattern("^(?!\\s+$).+")]),
      availableStatus: new FormControl(time?.availableStatus ?? 0),
    })
  }

  //#endregion



  openNew() {
    //    this.sectionForm = this.initsectionForm(null);    

    this.doctorForm = this.initDoctorForm(null);
    this.downloadedFiles = [];
    this.doctorPriceFormArray = this.inintDoctorPriceFormArr();
    this.doctorAppointmentsFormArray = this.initDoctorAppointmentsFormArr();

    this.doctorPriceFormArray.clear();

    this.doctorPriceFormArray.push(this.initDoctorPriceFormGroup(null));
    this.doctorAppointmentsFormArray.clear();

    this.setDoctorAppointmentsData(null);
    //this.expandAll();
    this.titleService.setTitle(this._localizeServe.getLabelValue('lbl_addDoctor'));
    this.showDialog('lbl_addDoctor', true);
  }

  getWeekDaysData() {
    this.sharedDataServ.getweekDaysData().subscribe((res) => {
      this.weekDays = res;
    });
  }
  getTypeOfMedicalExaminationData() {
    this.sharedDataServ.getTypeOfMedicalExaminationData().subscribe((res) => {
      this.typeOfMedicalExaminationData = res;
    });
  }
  setDoctorAppointmentsData(doctorApp: any) {
    this.weekDays.forEach(d => {

      this.doctorAppointmentsFormArray.push(this.initDoctorAppointmentsFormGruoup(doctorApp, d.key));

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
    if(this.doctorCustomDialog != undefined)
    {
    this.doctorCustomDialog.header = this._localizeServe.getLabelValue(dialogHeader);
    this.doctorCustomDialog.saveOrEdit = saveOrEdit;
    this.doctorsDialog = true;
    }
  }
  addTimeToWeekDay(doctorApp: FormGroup) {
    if (doctorApp?.get('doctorAppointmentTimes') != null) {
      let doctorAppointmentTimesArr: FormArray = doctorApp?.get('doctorAppointmentTimes') as FormArray;

      doctorAppointmentTimesArr.push(this.inintDoctorAppointmentTimesFromGroup(null));
    }

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
  getPaginatedData() {

    let pageIndex: number = 0;
    let sectionPaginator = this.paginatorRef.paginatorRef;

    if (sectionPaginator.first == 0) pageIndex = sectionPaginator.first + 1;
    else
      pageIndex = (sectionPaginator.first / sectionPaginator.rows) + 1;
    this.getDoctorsData(pageIndex, sectionPaginator.rows, this.txtCustomtxtSearchDoctors.txtSerach, null);
  }
  showConfirmDialogAndSetDoctorToDelete(keyId: number) {
    this.doctorKeyIdToDelete = keyId;
    this.customDeleteDialog.showDialog('lbl_sureToDelete', 'lbl_confirm', 'lbl_yes', 'lbl_no');

  }
  getDoctorForEdit(keyId: number) {
    this._doctorServ.getDoctorById(keyId).subscribe((res) => {
      this.setDoctorsDataForEdit(res);
      this.titleService.setTitle(this._localizeServe.getLabelValue('lbl_editDoctor'));
      this.showDialog('lbl_editDoctor', false);
    });
  }

  setDoctorsDataForEdit(res: any) {

    this.doctorForm = this.initDoctorForm(res);

    this.downloadedFiles = [];
    if (res.imageLogoPath != undefined) {
      let underscoreIndex = res.imageLogoPath.indexOf('_');
      let actualFileName = res.imageLogoPath.substring(underscoreIndex + 1);
      let newFile = {
        imageLogoPath: res.imageLogoPath,
        name: actualFileName,
        originalPath: res.originalPath
      };
      this.downloadedFiles.push(newFile);
    }

    this.doctorPriceFormArray = this.inintDoctorPriceFormArr();
    this.doctorAppointmentsFormArray = this.initDoctorAppointmentsFormArr();
    this.doctorPriceFormArray.clear();

    res.doctorPriceLists.forEach((per: any, index: number) =>
      this.doctorPriceFormArray.setControl(index, this.initDoctorPriceFormGroup(per)));

    this.doctorAppointmentsFormArray.clear();
    res.doctorAppointments.forEach((per: any, index: number) => {
      let appointmentFormGroup = this.initDoctorAppointmentsFormGruoup(per, null);
      this.doctorAppointmentsFormArray.setControl(index, appointmentFormGroup);
      let appointmenTimesArray = appointmentFormGroup.get('doctorAppointmentTimes') as FormArray;
      appointmenTimesArray.clear();
      per.doctorAppointmentTimes.forEach((time: any, timeIndex: number) => {
        appointmenTimesArray.setControl(timeIndex, this.inintDoctorAppointmentTimesFromGroup(time))
      });
    });


  }

  setDoctorFormData(): FormData {
    let formData = new FormData();

    formData.append('doctorData', JSON.stringify(this.doctorForm.value));
    if (this.uploadedFiles.length > 0) {
      formData.append('imageFile', this.uploadedFiles[0], this.uploadedFiles[0].name);

    }
    return formData;
  }
  onSave() {
    if (this.doctorForm.valid) {
      const httpOptions = {
        headers: new HttpHeaders()
        // No Content-Type header is needed when sending FormData
      };
      let formData = this.setDoctorFormData();
      this._doctorServ.saveDoctorData(formData, httpOptions).subscribe((res) => {
        this.messageService.add({
          severity: 'success', summary: this._localizeServe.getLabelValue('lbl_success')
          , detail: this._localizeServe.getLabelValue('lbl_missionCompletedSuccessfully')
        });
        this.getPaginatedData();
        //this.doctorsDialog = false;
      });
    }
    else {
      this.doctorForm.markAllAsTouched();
      this.customDeleteDialog.showDialog('lbl_someEntriesAreMissingOrIncorrect', 'lbl_warning', 'lbl_Ok', 'lbl_Ok', false);
    }
  }
  onEdit() {
    if (this.doctorForm.valid) {
      const httpOptions = {
        headers: new HttpHeaders()
        // No Content-Type header is needed when sending FormData
      };
      let formData = this.setDoctorFormData();
      this._doctorServ.editDoctorData(formData, httpOptions).subscribe((res) => {
        this.messageService.add({
          severity: 'success', summary: this._localizeServe.getLabelValue('lbl_success')
          , detail: this._localizeServe.getLabelValue('lbl_missionCompletedSuccessfully')
        });
        this.getDoctorForEdit(this.doctorForm.get('keyId')?.value);
        this.getPaginatedData();
        //this.doctorsDialog = false;
      });
    }
    else {
      this.doctorForm.markAllAsTouched();
      this.customDeleteDialog.showDialog('lbl_someEntriesAreMissingOrIncorrect', 'lbl_warning', 'lbl_Ok', 'lbl_Ok', false);
    }

  }
  onDelete() {

    if (this.doctorKeyIdToDelete != null) {
      this._doctorServ.deleteDoctor(this.doctorKeyIdToDelete).subscribe((res) => {
        this.messageService.add({
          severity: 'success', summary: this._localizeServe.getLabelValue('lbl_success')
          , detail: this._localizeServe.getLabelValue('lbl_missionCompletedSuccessfully')
        });
        this.getPaginatedData();
      });
    }
  }
  showDoctorAppointmentTimeDialog(doctorApp: any, rowIndex: number) {
    this.doctorAppToDelete = doctorApp;
    this.doctorAppIndexToDelete = rowIndex;

    this.customDoctorAppointmentDialog.showDialog('lbl_sureToDelete', 'lbl_confirm', 'lbl_yes', 'lbl_no');
  }
  deleteDoctorAppointmentTime() {

    if (this.doctorAppToDelete != null && this.doctorAppIndexToDelete != null) {

      if (this.doctorAppToDelete?.get('doctorAppointmentTimes') != null) {
        let doctorAppointmentTimesArr: FormArray = this.doctorAppToDelete?.get('doctorAppointmentTimes') as FormArray;

        doctorAppointmentTimesArr.removeAt(this.doctorAppIndexToDelete!);
      }


      this.doctorAppToDelete = null;
      this.doctorAppIndexToDelete = null;


    }
  }

  showPricesConfirmDialog(rowIndex: number) {
    this.doctorPriceRowIndexToDelete = rowIndex;
    this.customDoctorPricesDialog.showDialog('lbl_sureToDelete', 'lbl_confirm', 'lbl_yes', 'lbl_no');
  }
  deletePriceFromPricesFormArray() {
    if (this.doctorPriceRowIndexToDelete != null) {
      this.doctorPriceFormArray.removeAt(this.doctorPriceRowIndexToDelete);
      this.doctorPriceRowIndexToDelete = null;
    }
  }


  getTypeOfMedicalExaminationValue(key: number) {
    return this.typeOfMedicalExaminationData.find(t => t.key == key)?.value ?? this._localizeServe.getLabelValue('lbl_choose');
  }

  getAvailableStatusValue(key: number) {
    return this.availableStatusData.find(a => a.key == key).value ?? '';
  }

  getWeekDaysValue(key: number) {
    return this.weekDays.find(a => a.key == key).value ?? '';
  }

  printDoctorsData() {
    let obj = {
      data: this.doctorsData,
      printAll: this.printAll

    };
    let jsonString = JSON.stringify(obj);
    this.printServ.generateReportWithBodyWithHeaders('Doctor/print', jsonString, this._localizeServe.getLabelValue('lbl_doctorsReport'), { "Content-Type": "application/json" });
  }

  //#region upload Doctor Picture
  onSelectFile(event: any) {
    this.uploadedFiles = [];
    for (let file of event.files) {
     if(file.size<=30000)
      this.uploadedFiles.push(file);
    }
  }
  onClearFile() {
    this.uploadedFiles = [];
  }
  // getEnterpriseInfoData() {
  //   this.enterpriseInfoServ.getEnterpriseInfo().subscribe((res) => {
  //     if (res != null) {
  //       this.enterPriseInfoForm = this.initEnterPriseInfoForm(res);


  //       this.downloadedFiles = [];
  //       if (res.imageLogoPath != undefined) {
  //         let underscoreIndex = res.imageLogoPath.indexOf('_');
  //         let actualFileName = res.imageLogoPath.substring(underscoreIndex + 1);
  //         let newFile = {
  //           imageLogoPath: res.imageLogoPath,
  //           name: actualFileName,
  //           originalPath: res.originalPath
  //         };
  //         this.downloadedFiles.push(newFile);          
  //       }

  //     }
  //   });
  // }
  setPathOfLogoToDelete(fileName: string) {
    this.doctorImagefileNameToDelete = fileName;
    this.deleteImageConfirmDialog.showDialog('lbl_sureToDelete', 'lbl_confirm', 'lbl_yes', 'lbl_no');
  }
  deleteDoctorImage() {
    if (this.doctorImagefileNameToDelete != null) {
      this._doctorServ.deleteImageFile(this.doctorImagefileNameToDelete, this.doctorForm.get('keyId')?.value).subscribe((res) => {
        this.messageService.add({
          severity: 'success', summary: this._localizeServe.getLabelValue('lbl_success')
          , detail: this._localizeServe.getLabelValue('lbl_missionCompletedSuccessfully')
        });
        this.getDoctorForEdit(this.doctorForm.get('keyId')?.value);
      });
    }
  }
  //#endregion

  checkIfUserIsBooked(event: DropdownChangeEvent) {
    if (event.value != null) {
      let user = this.adminUsersData.find(u => u.id == event.value);
      
        
        this._doctorServ.checkIfUserIsBooked(event.value , this.doctorForm.get('keyId')?.value).subscribe((res) => {
          if (res.booked) {
            this.customDeleteDialog.showDialog('lbl_thisUserUsedBefore', 'lbl_warning', 'lbl_Ok', 'lbl_Ok', false);
          this.doctorForm.get('appUserId')?.setValue(null);
          this.doctorForm.get('appUserId')?.markAllAsTouched();
          }
        }); 

      
    }
  }
  onDialogClose()
  {
    let title = this._localizeServe.getLabelValue('lbl_showDoctors');
    if (title != '')
      this.titleService.setTitle(title);
  }
}
