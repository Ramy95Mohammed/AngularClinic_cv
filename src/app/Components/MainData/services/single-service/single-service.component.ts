import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomPrintBtnComponent } from '../../../customComponents/customPrintBtn/custom-print-btn/custom-print-btn.component';
import { CustomClearBtnComponent } from '../../../customComponents/customClearBtn/custom-clear-btn/custom-clear-btn.component';
import { ImportsModule } from '../../../../app/imports';
import { CustomConfirmDialogComponent } from '../../../customComponents/customConfirmDialogComponent/custom-confirm-dialog/custom-confirm-dialog.component';
import { CustomDeleteBtnComponent } from '../../../customComponents/customDeleteBtn/custom-delete-btn/custom-delete-btn.component';
import { CustomDialogComponent } from '../../../customComponents/customDialogComponent/custom-dialog/custom-dialog.component';
import { CustomEditBtnComponent } from '../../../customComponents/customEditBtn/custom-edit-btn/custom-edit-btn.component';
import { CustomNewBtnComponent } from '../../../customComponents/customNewBtn/custom-new-btn/custom-new-btn.component';
import { CustomPaginatorFilterSearchComponent } from '../../../customComponents/customPaginatorFilterSearch/custom-paginator-filter-search/custom-paginator-filter-search.component';
import { CustomSearchFilterInputComponent } from '../../../customComponents/customSearchFilterInput/custom-search-filter-input/custom-search-filter-input.component';
import { LocalizeService } from '../../../../services/localize/localize.service';
import { SingleServiceService } from '../../../../services/mainData/services/singleServices/single-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomSearchFilterDropDownComponent } from "../../../customComponents/customSearchFilterDropDown/custom-search-filter-drop-down/custom-search-filter-drop-down.component";
import { SharedDataService } from '../../../../services/sharedData/shared-data.service';
import { HelperService } from '../../../../services/helper.service';
import { Title } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { PrintService } from '../../../../services/printingservice/print.service';

@Component({
  selector: 'app-single-service',
  standalone: true,
  imports: [ImportsModule, CustomDialogComponent, CustomConfirmDialogComponent, CustomEditBtnComponent, CustomDeleteBtnComponent, CustomNewBtnComponent, CustomPaginatorFilterSearchComponent, CustomSearchFilterInputComponent, CustomClearBtnComponent, CustomPrintBtnComponent, CustomSearchFilterDropDownComponent],
  templateUrl: './single-service.component.html',
  styleUrl: './single-service.component.scss'
})
export class SingleServiceComponent implements OnInit {
  ControllerName: string = 'SingleService';
  printAll: boolean = false;
  _localizeServe: LocalizeService;
  txtSearch: string = '';
  singleServicesData: any[] = [];
  totalRecords: number = 10;
  singeServiceDialog: boolean = false;
  activityStatusData: any[] = [];
  singleServiceKeyId: number | null = null;
  singleServicesForm: FormGroup;
  priceCurrency: string = this._helperServ.currency;
  @ViewChild('singelServiceCustomDialog') singelServiceCustomDialog!: CustomDialogComponent;
  @ViewChild('paginatorRef') paginatorRef!: CustomPaginatorFilterSearchComponent;
  @ViewChild('drpIsActive') drpIsActive!: CustomSearchFilterDropDownComponent;
  @ViewChild('txtCustomtxtSearchSextions') txtCustomtxtSearchSextions!: CustomSearchFilterInputComponent;
  @ViewChild('customDeleteDialog') customDeleteDialog!: CustomConfirmDialogComponent;
  @ViewChild('dt') dt!: Table;
  constructor(localizeServ: LocalizeService, private _singleServ: SingleServiceService, private _sharedServ: SharedDataService, private _helperServ: HelperService, private titleService: Title, private messageService: MessageService,private printServ:PrintService) {
    this._localizeServe = localizeServ;
    this.singleServicesForm = this.initSingleServicesForm(null);
  }
  ngOnInit(): void {
    let title = this._localizeServe.getLabelValue('lbl_singleServices');
    if (title != '')
      this.titleService.setTitle(title);
    this.getSingleServicesData(1, 10, this.txtSearch, null, null);
    this.getActivityStatusData();
  }
  hideDialog() {
    this.singeServiceDialog = false;
  }


  initSingleServicesForm(singleServ: any): FormGroup {
    return new FormGroup({
      keyId: new FormControl(singleServ?.keyId ?? 0, Validators.required),
      name: new FormControl(singleServ?.name ?? '', [Validators.required, Validators.pattern("^(?!\\s+$).+")]),
      price: new FormControl(singleServ?.price ?? 1, [Validators.required, Validators.pattern("^(?!\\s+$).+")]),
      description: new FormControl(singleServ?.description),
      isActive: new FormControl(singleServ?.isActive ?? true)
    });
  }

  getPaginatedData() {
    let pageIndex: number = 0;
    let sectionPaginator = this.paginatorRef.paginatorRef;

    if (sectionPaginator.first == 0) pageIndex = sectionPaginator.first + 1;
    else
      pageIndex = (sectionPaginator.first / sectionPaginator.rows) + 1;

    let isActiveDrpValue = this.drpIsActive.value == 1 ? true : this.drpIsActive.value == 0 ? false : null;
    this.getSingleServicesData(pageIndex, sectionPaginator.rows, this.txtCustomtxtSearchSextions.txtSerach, null, isActiveDrpValue);

  }

  getSingleServicesData(pageIndex: number, pageSize: number, searchValue: string, sort: string | null, isActive: any) {
    this._singleServ.getSingleServicesData(pageIndex, pageSize, searchValue, sort, isActive).subscribe((res) => {

      this.singleServicesData = res.data;
      this.totalRecords = res.count;
    });
  }
  getActivityStatusData() {
    this._sharedServ.getActivityStatusData().subscribe((res) => {
      this.activityStatusData = res;
    });
  }
  getActivityValue(activity: boolean): string {
    return (activity) ? this._localizeServe.getLabelValue('lbl_active') : this._localizeServe.getLabelValue('lbl_Inactive');
  }
  getSeverity(status: boolean): any {
    switch (status) {
      case true:
        return 'success';

      case false:
        return 'danger';
    }
  }
  resetSearchControls() {
    this.dt.reset();
    this.txtCustomtxtSearchSextions.txtSerach = '';
    this.drpIsActive.value = null;
  }
  openNew() {
    this.singleServicesForm = this.initSingleServicesForm(null);
    this.titleService.setTitle(this._localizeServe.getLabelValue('lbl_addSingleService'));
    this.showDialog('lbl_addSingleService', true);
  }
  showDialog(dialogHeader: string, saveOrEdit: boolean = true) {

    if (this.singelServiceCustomDialog != undefined) {
      this.singelServiceCustomDialog.header = this._localizeServe.getLabelValue(dialogHeader);
      this.singelServiceCustomDialog.saveOrEdit = saveOrEdit;
      this.singeServiceDialog = true;
    }
  }
  showConfirmDialog(keyId: number) {
    this.singleServiceKeyId = keyId;
    this.customDeleteDialog.showDialog('lbl_sureToDelete', 'lbl_confirm', 'lbl_yes', 'lbl_no');
  }
  onSave(): void {
    if (this.singleServicesForm.valid) {
      this._singleServ.saveNewService(this.singleServicesForm.value).subscribe((res) => {
        this.messageService.add({
          severity: 'success', summary: this._localizeServe.getLabelValue('lbl_success')
          , detail: this._localizeServe.getLabelValue('lbl_missionCompletedSuccessfully')
        });

        //this.hideDialog();
        this.singleServicesForm = this.initSingleServicesForm(null);
        this.getPaginatedData();
      });
    }
    else {
      this.singleServicesForm.markAllAsTouched();
    }
  }
  onEdit(): void {
    if (this.singleServicesForm.valid) {
      this._singleServ.editSingleService(this.singleServicesForm.value).subscribe((res) => {
        this.messageService.add({
          severity: 'success', summary: this._localizeServe.getLabelValue('lbl_success')
          , detail: this._localizeServe.getLabelValue('lbl_missionCompletedSuccessfully')
        });

        //this.hideDialog();
        this.singleServicesForm = this.initSingleServicesForm(null);
        this.getPaginatedData();
      });
    }
    else {
      this.singleServicesForm.markAllAsTouched();
    }
  }
  getSingleServiceForEdit(keyId: number) {
    this._singleServ.getSingleServiceById(keyId).subscribe((res) => {
      this.singleServicesForm = this.initSingleServicesForm(res);
      this.titleService.setTitle(this._localizeServe.getLabelValue('lbl_editSingleService'));
      this.showDialog('lbl_editSingleService', false);
    });
  }
  onDelete() {
    if (this.singleServiceKeyId != null) {
      this._singleServ.deleteSingleService(this.singleServiceKeyId).subscribe((res) => {
        this.messageService.add({
          severity: 'success', summary: this._localizeServe.getLabelValue('lbl_success')
          , detail: this._localizeServe.getLabelValue('lbl_missionCompletedSuccessfully')
        });

        this.hideDialog();
        this.singleServicesForm = this.initSingleServicesForm(null);
        this.singleServiceKeyId = null;
        this.getPaginatedData();
      }
        // ,
        //   (err) => {

        //     if (err?.error?.errors?.entries((s: any) => s == 'This Section Exists DoctrosTable')) {
        //       this.customMessageDialog.showDialog('lbl_thisRecordExistsInOtherTablesDeleteItFromOthersAndTryAgain', 'lbl_warning', 'lbl_Ok', 'lbl_Ok', false);
        //     }
        //   }
      );
    }
  }
    printSingleServicesData() {
    let obj = {
      data:  this.singleServicesData,
      printAll: this.printAll

    };
    let jsonString = JSON.stringify(obj);    
    this.printServ.generateReportWithBodyWithHeaders('SingleService/print', jsonString, this._localizeServe.getLabelValue('lbl_SingleServicesReport'), { "Content-Type": "application/json" });
  }
  onDialogClose() {
    let title = this._localizeServe.getLabelValue('lbl_singleServices');
    if (title != '')
      this.titleService.setTitle(title);
  }
}
