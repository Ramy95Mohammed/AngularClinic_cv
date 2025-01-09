import { Component, ContentChild, Input, TemplateRef, input, OnInit, Output, EventEmitter, ViewChild, viewChild } from '@angular/core';
import { ImportsModule } from '../../../../app/imports';
import { LocalizeService } from '../../../../services/localize/localize.service';
import { CustomDialogComponent } from '../../customDialogComponent/custom-dialog/custom-dialog.component';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { SharedDataService } from '../../../../services/sharedData/shared-data.service';
import { Dropdown, DropdownChangeEvent } from 'primeng/dropdown';
import { CustomSearchBtnComponent } from '../../customSeachBtn/custom-search-btn/custom-search-btn.component';
import { CustomEditBtnComponent } from '../../customEditBtn/custom-edit-btn/custom-edit-btn.component';
import { CustomDeleteBtnComponent } from '../../customDeleteBtn/custom-delete-btn/custom-delete-btn.component';
import { PermissionsSpecificationService } from './../../../../services/users/permissions/permissions-specification.service';
import { CustomConfirmDialogComponent } from '../../customConfirmDialogComponent/custom-confirm-dialog/custom-confirm-dialog.component';
import { CustomSaveBtnComponent } from "../../customSaveBtn/custom-save-btn/custom-save-btn.component";
import { CustomNewBtnComponent } from '../../customNewBtn/custom-new-btn/custom-new-btn.component';
import { MessageService } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { CheckboxChangeEvent } from 'primeng/checkbox';
import { Table } from 'primeng/table';
import { CustomPrintBtnComponent } from "../../customPrintBtn/custom-print-btn/custom-print-btn.component";
import { CustomSearchFilterInputComponent } from "../../customSearchFilterInput/custom-search-filter-input/custom-search-filter-input.component";
import { CustomSearchFilterDropDownComponent } from '../../customSearchFilterDropDown/custom-search-filter-drop-down/custom-search-filter-drop-down.component';
import { CustomPaginatorFilterSearchComponent } from "../../customPaginatorFilterSearch/custom-paginator-filter-search/custom-paginator-filter-search.component";
import { CustomClearBtnComponent } from "../../customClearBtn/custom-clear-btn/custom-clear-btn.component";

@Component({
  selector: 'app-shared-permissions-specifications-ui',
  standalone: true,
  imports: [ImportsModule, CustomDialogComponent, CustomSearchBtnComponent, CustomEditBtnComponent, CustomDeleteBtnComponent, CustomConfirmDialogComponent, CustomSaveBtnComponent, CustomNewBtnComponent, CustomPrintBtnComponent, CustomSearchFilterInputComponent,
    CustomSearchFilterDropDownComponent, CustomPaginatorFilterSearchComponent, CustomClearBtnComponent],
  templateUrl: './shared-permissions-specifications-ui.component.html',
  styleUrl: './shared-permissions-specifications-ui.component.scss'
})
export class SharedPermissionsSpecificationsUIComponent implements OnInit {
  _localizeServe: LocalizeService;
  txtSearchSherdPermissions: string = '';
  txtSearchForPermissionsMaster: string = '';
  permissionsDialog: boolean = false;
  @ViewChild('customDeleteDialog') customDeleteDialog!: CustomConfirmDialogComponent;
  permissionsMaster: any[] = [];
  totalRecords: number = 10;
  @Input() data: any[] = [];

  @Input() userWithoutPermissionsData: any[] = [];
  @Input() usersHavePermissions: any[] = [];

  @ViewChild('pagesCategoriesDropDown') pagesCategoriesDropDown!: CustomSearchFilterDropDownComponent
  @ViewChild('dtPermissions') dtPermissions!: Table
  @ViewChild('dtUsersWithoutPermissions') dtUsersWithoutPermissions!: Table
  @ViewChild('dtHavePermssions') dtHavePermssions!: Table
  @ViewChild('permissionsCustomDialog') permissionsCustomDialog!: CustomDialogComponent
  @ViewChild('paginatorRefPermissionsMaster') paginatorRefPermissionsMaster!: CustomPaginatorFilterSearchComponent
  @ViewChild('txtCustomtxtSearchSherdPermissions') txtCustomtxtSearchSherdPermissions!:CustomSearchFilterInputComponent;
  @ViewChild('txtCustomSearchUsersWithoutPermissions') txtCustomSearchUsersWithoutPermissions!:CustomSearchFilterInputComponent;
  @ViewChild('txtCustomSearchUsersHavePermission') txtCustomSearchUsersHavePermission!:CustomSearchFilterInputComponent;
  @ViewChild('txtCustomtxtSearchPermissionsMaster') txtCustomtxtSearchPermissionsMaster!:CustomSearchFilterInputComponent;
  hideBtnEdit: boolean = true;
  @Input() ControllerName: string = 'PermissionsSpecification';
  @Input() emitBtnNewClickEvent: () => void = () => {
    this.onBtnNewClick.emit();
  };
  @Output() onBtnSaveClick: EventEmitter<any> = new EventEmitter();
  @Output() onRowBtnEditClick: EventEmitter<any> = new EventEmitter();
  @Output() onRowBtnDeleteClick: EventEmitter<any> = new EventEmitter();
  @Output() onBtnEditClick: EventEmitter<any> = new EventEmitter();
  @Output() onBtnNewClick: EventEmitter<any> = new EventEmitter();
  @Output() onBtnImportClick: EventEmitter<any> = new EventEmitter();
  @Output() onBtnPrintClick: EventEmitter<any> = new EventEmitter();
  pagesCategoriesData: any[] = [];
  permissionMasterToEdit: number | null = null;
  permissionMasterToDelete: number | null = null;
  txtSearchUsersWithoutPermissions:string='';
  txtSearchUsersHavePermissions:string='';

  constructor(localizeServe: LocalizeService, private _sahredData: SharedDataService, private messageService: MessageService, private permissionsSpecificationServ: PermissionsSpecificationService) {
    this._localizeServe = localizeServe;



  }
  ngOnInit(): void {
    this._sahredData.getPagesCategoriesData().subscribe((data) => {
      this.pagesCategoriesData = data;
    });

  }
  getPermissiosnMasterData(pageIndex: number, pageSize: number, searchValue: string, sort: string | null) {
    this.permissionsSpecificationServ.getPermissionsMaster(pageIndex, pageSize, searchValue, sort).subscribe((data) => {
      this.permissionsMaster = data.data;
      this.totalRecords = data.count;
    });
  }
  onPageChange(event: any) {
    this.getDataWithPaginator(event);
  }

  getDataWithPaginator(event: any) {
    let pageIndex: number = 0;
    if (event.first == 0) pageIndex = event.first + 1;
    else
      pageIndex = (event.first / event.rows) + 1;
    this.getPermissiosnMasterData(pageIndex, event.rows, this.txtSearchForPermissionsMaster, null);
  }

  showDeleteDialog(keyId: number) {
    this.permissionMasterToDelete = keyId;
    this.customDeleteDialog.showDialog('lbl_permissionMasterAndDetailsWillDeleted', 'lbl_confirm', 'lbl_Ok', 'lbl_cancel');

  }
  clearPermissiosnMasterFilters()
  {
    this.txtCustomtxtSearchPermissionsMaster.txtSerach = '' ;
    this.getDataWithPaginator(this.paginatorRefPermissionsMaster.paginatorRef); 
  }
  hideDialog() {
    this.permissionsDialog = false;
  }
  onSave(): void {
    console.log('Save button clicked from Parent! Save');
    // Add any additional logic for Save here
  }
  onEdit(): void {
    console.log('Save button clicked from Parent! Save');
    // Add any additional logic for Save here
  }
  calculateTotal(name: string) {
    let total = 0;

    if (this.data) {
      for (let per of this.data) {
        if (per.pageCategoryName === name) {
          total++;
        }
      }
    }

    return total;
  }

  getByFiltering() {
    const searchTerm = this.txtCustomtxtSearchSherdPermissions.txtSerach.trim().toLowerCase();
    this.data.forEach(s => {
      const matchesUserControllerName = s.userControllerName.toLowerCase().includes(searchTerm) || searchTerm == '';
      const matchesPageCategoryName = s.pageCategoryName.toLowerCase().includes(searchTerm) || searchTerm == '';
      const filterByCategory = s.pageCategory == this.pagesCategoriesDropDown.value || this.pagesCategoriesDropDown.value == null;

      s.isRowShown = (matchesUserControllerName || matchesPageCategoryName) && filterByCategory;
    });
  }
  getActivityValue(activity: number): string {
    if(activity == 0)
      return this._localizeServe.getLabelValue('lbl_Inactive');
    else if(activity == 1)
    return this._localizeServe.getLabelValue('lbl_active');
  return '';
  }
  getSeverity(status: number): any {
    switch (status) {
      case 1:
        return 'success';

      case 0:
        return 'danger';
    }
  }
  showDialogPermissions() {
    this.getPermissiosnMasterData(1, 10, this.txtSearchForPermissionsMaster, null);
    this.permissionsDialog = true;
  }
  getPermissionMasterAndDetailsToEdit(keyId: number) {
    this.permissionMasterToEdit = keyId;
    this.hideBtnEdit = false;
    this.onRowBtnEditClick.emit();
  }
  getPermissionMasterAndDetailsToDelete(): any {
    this.onRowBtnDeleteClick.emit();
  }

  addUserToPermssionsList(i: any): any {
    let userNeedAddingToPermissionList = this.userWithoutPermissionsData.at(i);
    if (userNeedAddingToPermissionList != undefined) {
      this.userWithoutPermissionsData.splice(i, 1);
      this.usersHavePermissions.push(userNeedAddingToPermissionList);
    }
  }
  deleteUserFromPermissionList(i: any) {
    let userNeedToRemoveFromPermissionList = this.usersHavePermissions.at(i);

    if (userNeedToRemoveFromPermissionList != undefined) {
      this.usersHavePermissions.splice(i, 1);
      this.userWithoutPermissionsData.push(userNeedToRemoveFromPermissionList);

    }
  }
  saveNewPermissionMasterWithDetails() {
    this.onBtnSaveClick.emit();
  }
  editPermissionMasterAndDetails() {

    this.onBtnEditClick.emit();
  }
  importPermissionsAsTheSame(keyId: number) {
    this.permissionMasterToEdit = keyId;
    this.hideBtnEdit = true;
    this.onBtnImportClick.emit();
  }
  checkAllPermissionsPerLine(event: CheckboxChangeEvent, per: any) {
    this.checkObjectsForPermissions(event, per);
  }

  checkObjectsForPermissions(event: CheckboxChangeEvent, per: any) {
    per.canSee = event.checked;
    per.canSave = event.checked;
    per.canEdit = event.checked;
    per.canDelete = event.checked;
    per.canPrint = event.checked;
    per.canSearch = event.checked;
    per.doAll = event.checked;
  }
  checkAllPermissions(event: CheckboxChangeEvent) {
    this.data.forEach(x => this.checkObjectsForPermissions(event, x));
  }

  printPermissionsWithDetails() {
    this.onBtnPrintClick.emit();
  }

  filterGlobalUsersWithoutPermissions() {
    this.dtUsersWithoutPermissions.filterGlobal(this.txtCustomSearchUsersWithoutPermissions.txtSerach, 'contains')

  }
  filterGlobalUsersHavePermissions() {
    this.dtHavePermssions.filterGlobal(this.txtCustomSearchUsersHavePermission.txtSerach, 'contains')

  }
}

