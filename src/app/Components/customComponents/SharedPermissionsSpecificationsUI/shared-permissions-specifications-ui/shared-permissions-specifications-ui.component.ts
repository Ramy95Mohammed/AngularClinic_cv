import { Component, ContentChild, Input, TemplateRef, input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-shared-permissions-specifications-ui',
  standalone: true,
  imports: [ImportsModule, CustomDialogComponent, CustomSearchBtnComponent, CustomEditBtnComponent, CustomDeleteBtnComponent, CustomConfirmDialogComponent, CustomSaveBtnComponent, CustomNewBtnComponent, CustomPrintBtnComponent],
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

  @ViewChild('pagesCategoriesDropDown') pagesCategoriesDropDown!: Dropdown
  @ViewChild('dtPermissions') dtPermissions!: Table
  @ViewChild('dtUsersWithoutPermissions') dtUsersWithoutPermissions!: Table
  @ViewChild('dtHavePermssions') dtHavePermssions!: Table
  @ViewChild('permissionsCustomDialog') permissionsCustomDialog!: CustomDialogComponent
  @ViewChild('paginatorRef') paginatorRef!: Paginator
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
    const searchTerm = this.txtSearchSherdPermissions.trim().toLowerCase();

    this.data.forEach(s => {
      const matchesUserControllerName = s.userControllerName.toLowerCase().includes(searchTerm) || searchTerm == '';
      const matchesPageCategoryName = s.pageCategoryName.toLowerCase().includes(searchTerm) || searchTerm == '';
      const filterByCategory = s.pageCategory == this.pagesCategoriesDropDown.value || this.pagesCategoriesDropDown.value == null;

      s.isRowShown = (matchesUserControllerName || matchesPageCategoryName) && filterByCategory;
    });
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

  filterGlobalUsersWithoutPermissions(event: any) {
    this.dtUsersWithoutPermissions.filterGlobal(event.target.value, 'contains')

  }
  filterGlobalUsersHavePermissions(event: any) {
    this.dtHavePermssions.filterGlobal(event.target.value, 'contains')

  }
}

