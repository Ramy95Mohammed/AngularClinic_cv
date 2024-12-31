import { Component, OnInit, ViewChild, inject, AfterViewInit } from '@angular/core';
import { ImportsModule } from '../../../app/imports';
import { LocalizeService } from '../../../services/localize/localize.service';
import { FormControl, FormGroup, NgForm, NgModel, Validators } from '@angular/forms';
import { AccountService } from '../../../services/account/account.service';
import { MessageService, SelectItem } from 'primeng/api';
import { Title } from "@angular/platform-browser";
import { SharedDataService } from '../../../services/sharedData/shared-data.service';
import { Dropdown } from 'primeng/dropdown';
import { CustomSaveBtnComponent } from "../../customComponents/customSaveBtn/custom-save-btn/custom-save-btn.component";
import { CustomSearchBtnComponent } from "../../customComponents/customSeachBtn/custom-search-btn/custom-search-btn.component";
import { CustomDialogComponent } from "../../customComponents/customDialogComponent/custom-dialog/custom-dialog.component";
import { CustomDeleteBtnComponent } from "../../customComponents/customDeleteBtn/custom-delete-btn/custom-delete-btn.component";
import { CustomEditBtnComponent } from "../../customComponents/customEditBtn/custom-edit-btn/custom-edit-btn.component";
import { Table } from 'primeng/table';
import { CustomClearBtnComponent } from "../../customComponents/customClearBtn/custom-clear-btn/custom-clear-btn.component";
import { CustomSearchFilterInputComponent } from "../../customComponents/customSearchFilterInput/custom-search-filter-input/custom-search-filter-input.component";
import { CustomPaginatorFilterSearchComponent } from "../../customComponents/customPaginatorFilterSearch/custom-paginator-filter-search/custom-paginator-filter-search.component";
import { CustomSearchFilterDropDownComponent } from "../../customComponents/customSearchFilterDropDown/custom-search-filter-drop-down/custom-search-filter-drop-down.component";
import { CustomConfirmDialogComponent } from "../../customComponents/customConfirmDialogComponent/custom-confirm-dialog/custom-confirm-dialog.component";
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ImportsModule, CustomSaveBtnComponent, CustomSearchBtnComponent, CustomDialogComponent, CustomDeleteBtnComponent, 
    CustomEditBtnComponent, CustomClearBtnComponent, CustomSearchFilterInputComponent, CustomPaginatorFilterSearchComponent,
     CustomSearchFilterDropDownComponent, CustomConfirmDialogComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  
})
export class RegisterComponent implements OnInit, AfterViewInit {
  @ViewChild('userPolicyDropdown') userPolicyDropdown!: Dropdown;
  @ViewChild('usersListCustomDialog') usersListCustomDialog!: CustomDialogComponent;
  @ViewChild('userForm') userForm!: NgForm;
  @ViewChild('userListDt') userListDt!: Table;
  localizeServ: LocalizeService;
  registerForm: FormGroup;
  dir: string | undefined = "";
  usersListDialogVisibility: boolean = false;
  userPolicyData: any[] = [];
  userAndClientPolicyData: any[] = [];
  activityStatusData: any[] = [];
  appUserTypeData: any[] = [];
  usersList: any[] = [];
  userIdToDelete:string|null = null;
  ControllerName: string = 'Account';  
  totalRecords: number = 10;
  @ViewChild('paginatorRef') paginatorRef!: CustomPaginatorFilterSearchComponent;
  @ViewChild('drpUserPolicySearchFilter') drpUserPolicySearchFilter!: CustomSearchFilterDropDownComponent;
  @ViewChild('drpUserTypeSearchFilter') drpUserTypeSearchFilter!: CustomSearchFilterDropDownComponent;
  @ViewChild('txtCustomtxtSearchUsersList') txtCustomtxtSearchUsersList!: CustomSearchFilterInputComponent;
  @ViewChild('confirmDialog') confirmDialog!: CustomConfirmDialogComponent;
  txtSearchUsersList: string = '';
  clonedUsers: { [s: string]: any } = {};

  constructor(private _localizeServ: LocalizeService, private _accountService: AccountService, private messageService: MessageService, private titleService: Title, private sharedDataServ: SharedDataService) {
    this.localizeServ = _localizeServ;
    this.registerForm = this.intializeForm();

  }
  ngAfterViewInit(): void {

  }
  ngOnInit(): void {

    let title = this._localizeServ.getLabelValue('lbl_registerUser');
    if (title != '')
      this.titleService.setTitle(title);
    this.getLayoutDirection();

    this.sharedDataServ.getUserPolicyData().subscribe(
      (data) => {
        this.userPolicyData = data
        this.userAndClientPolicyData = data;
        this.userPolicyData = this.userPolicyData.filter((_, index) => index !== 3);
      },
      (error) => {
      }
    );
    this.getActivityStatusData();
    this.getAppUserTypeData();
  }

  getActivityStatusData() {
    this.sharedDataServ.getActivityStatusData().subscribe((res) => {
      this.activityStatusData = res;
    });
  }
  getAppUserTypeData() {
    this.sharedDataServ.getAppUserTypeData().subscribe((res) => {
      this.appUserTypeData = res;
    });
  }

  intializeForm(): FormGroup {
    return new FormGroup({
      displayName: new FormControl(null, [Validators.required, Validators.pattern("^(?!\\s+$).+")]),
      userName: new FormControl(null),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.pattern("^(?=^.{8,10}$)(?=.*\\d)(?=.*[a-z])(?=.*[a-z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\\s).*$"), Validators.required]),
      appUserType: new FormControl(0, Validators.required),
      userPolicy: new FormControl(null, Validators.required),
    });
  }
  getLayoutDirection() {
    if (typeof document !== 'undefined') {
      this.dir = document.getElementById('mainLayout')?.dir;
    }
  }

  registerUser() {
    if (this.registerForm.valid) {
      this._accountService.registerNewUser(this.registerForm).subscribe((data) => {
        this.messageService.add({
          severity: 'success', summary: this.localizeServ.getLabelValue('lbl_success'),
          detail: this.localizeServ.getLabelValue('lbl_missionCompletedSuccessfully')
        });
        this.registerForm.reset();
      },
        (error) => {
          if (error.error != null && error.error.errors != null && error.error.errors.length > 0) {
            if (error.error.errors[0] == 'This Email Already In Use') {
              this.messageService.add({
                severity: 'error', summary: this.localizeServ.getLabelValue('lbl_error'),
                detail: this.localizeServ.getLabelValue('lbl_existUser')
              });
            }
          }

        });
    }
    else {
      this.registerForm.markAllAsTouched();
    }
  }
  getUsersListData(pageIndex: number,
    pageSize: number,
    searchValue: string | null,
    sort: string | null,
    appUserType: any | null,
    userPolicy: any | null,) {
    this._accountService.getUsersList(pageIndex, pageSize, searchValue, sort, appUserType, userPolicy).subscribe((res => {
      this.usersList = res.data;

    }));
  }
  getSeverity(status: number): any {
    switch (status) {
      case 1:
        return 'success';

      case 0:
        return 'danger';
    }
  }
  getAppUserTypeValue(type: number): string {
    return this.appUserTypeData.find(p => p.key == type)?.value;
  }
  getUserPolicyValue(policy: number): string {
    return this.userAndClientPolicyData.find(p => p.key == policy)?.value;
  }

  getActivityValue(activity: number): string {
    return this.activityStatusData.find(p => p.key == activity)?.value;
  }
  showDialogAndGetData() {
    this.usersListDialogVisibility = true;
    this.getUsersListData(1, 10, null, null, null, null);
  }
  onRowEditInit(user: any) {
    this.userListDt.initRowEdit(user);
    this.clonedUsers[user.id as string] = { ...user };
  }
  onRowEditSave(user: any) {
   
    let isTableInEditingMode = this.userListDt.isRowEditing(user);    
    if(isTableInEditingMode == false)
    {
    this._accountService.updateUser(user).subscribe((res) => {
  
      this.messageService.add({
        severity: 'success', summary: this.localizeServ.getLabelValue('lbl_success')
        , detail: this.localizeServ.getLabelValue('lbl_missionCompletedSuccessfully')
      });      
      this.getPaginatedData();
    });
  }
  }

  onRowEditCancel(user: any, index: number) {
    this.usersList[index] = this.clonedUsers[user.id as string];
    delete this.clonedUsers[user.id as string];
  }
  markRowAsTouched(user: any): boolean {
    if (user.displayName.trim() == '')
      return false;

    return true;
  }

  getPaginatedData() {
    let pageIndex: number = 0;
    let sectionPaginator = this.paginatorRef.paginatorRef;

    if (sectionPaginator.first == 0) pageIndex = sectionPaginator.first + 1;
    else
      pageIndex = (sectionPaginator.first / sectionPaginator.rows) + 1;
    this.getUsersListData(pageIndex, sectionPaginator.rows, this.txtCustomtxtSearchUsersList.txtSerach, null, this.drpUserTypeSearchFilter.value, this.drpUserPolicySearchFilter.value);
  }

  setDrpUserPolicyDataAndGetUsersListData() {
    if (this.drpUserTypeSearchFilter.value == null)
      this.drpUserPolicySearchFilter.dropDownData = [];
    else if (this.drpUserTypeSearchFilter.value == 0)
      this.drpUserPolicySearchFilter.dropDownData = this.userPolicyData;
    else {
      let usersOnlyPolicyData = this.userAndClientPolicyData.filter((_, index) => index >= 3);
      this.drpUserPolicySearchFilter.dropDownData = usersOnlyPolicyData;
    }
    this.getPaginatedData();
  }

  clearSearchFiltersAndGetUsersListData() {
    this.txtCustomtxtSearchUsersList.txtSerach = '';
    this.drpUserPolicySearchFilter.value = null;
    this.drpUserTypeSearchFilter.value = null;
    this.getPaginatedData();
  }

  setUserToDeleteAndShowDialog(id:string)
  {
     this.userIdToDelete = id;
     this.confirmDialog.showDialog('lbl_sureToDelete', 'lbl_confirm', 'lbl_yes', 'lbl_no');
  }
  deleteUser()
  {
    if(this.userIdToDelete != null)
    {
     this._accountService.deleteUser(this.userIdToDelete).subscribe((res)=>{

      this.messageService.add({
        severity: 'success', summary: this.localizeServ.getLabelValue('lbl_success')
        , detail: this.localizeServ.getLabelValue('lbl_missionCompletedSuccessfully')
      });      
      this.getPaginatedData();
     });
    }
  }
}

