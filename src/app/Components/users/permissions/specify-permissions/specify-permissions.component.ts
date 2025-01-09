import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedPermissionsSpecificationsUIComponent } from '../../../customComponents/SharedPermissionsSpecificationsUI/shared-permissions-specifications-ui/shared-permissions-specifications-ui.component';
import { PermissionsSpecificationService } from '../../../../services/users/permissions/permissions-specification.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ImportsModule } from '../../../../app/imports';
import { LocalizeService } from '../../../../services/localize/localize.service';
import { Title } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { CustomPrintBtnComponent } from "../../../customComponents/customPrintBtn/custom-print-btn/custom-print-btn.component";
import { PrintService } from '../../../../services/printingservice/print.service';

@Component({
  selector: 'app-specify-permissions',
  standalone: true,
  imports: [ImportsModule, SharedPermissionsSpecificationsUIComponent],
  templateUrl: './specify-permissions.component.html',
  styleUrl: './specify-permissions.component.scss'
})
export class SpecifyPermissionsComponent implements OnInit {
  @ViewChild('app_shared_permissions') app_shared_permissions!: SharedPermissionsSpecificationsUIComponent
  permissions: any[] = [];
  userWithoutPermissionsData: any[] = [];
  usersHavePermissions: any[] = [];
  _localizeServ: LocalizeService;
  permssionsSpecForm: FormGroup;
  permissionDetailsForm: FormArray<any>;
  usersPermissionForm: FormArray<any>;

  constructor(private permissionsSpecificationServ: PermissionsSpecificationService, localizeServ: LocalizeService, private titleService: Title
    , private messageService: MessageService, private _printServ: PrintService) {
    this._localizeServ = localizeServ;
    this.permssionsSpecForm = this.initPermissionForm(null);
    this.permissionDetailsForm = this.initPermissionsFormArr();
    this.usersPermissionForm = this.initUsersPermissionsFormArr();
  }
  ngOnInit(): void {
    let title = this._localizeServ.getLabelValue('lbl_specifyPermissions');
    if (title != '')
      this.titleService.setTitle(title);

    this.getInitialPermissionsFornewAddition();
    this.getUsersWithoutPermissionsData();
  }

  getPermissionsDetailForm(): FormArray {
    return this.permssionsSpecForm.get('permissionsSpecificationDetails') as FormArray;
  }

  getUserPermissionsForm(): FormArray {
    return this.permssionsSpecForm.get('userPermissions') as FormArray;
  }


  getInitialPermissionsFornewAddition() {
    this.permissionsSpecificationServ.getPermissionsDetails().subscribe((data) => {
      this.permissions = data;
    });
  }

  getUsersWithoutPermissionsData() {
    this.permissionsSpecificationServ.getusersWithoutPermissionsData().subscribe((data) => {
      this.userWithoutPermissionsData = data;
    });
  }

  initPermissionsFormArr(): FormArray<any> {
    return new FormArray<any>([this.initPermissionsFormGroup(null)]);
  }

  initUsersPermissionsFormArr(): FormArray<any> {
    return new FormArray<any>([this.initUserPermissionsFormGroup(null)]);
  }

  initPermissionsFormGroup(per: any): FormGroup {
    return new FormGroup({
      keyId: new FormControl(per?.keyId ?? 0),
      permissionsSpecificationId: new FormControl(per?.permissionsSpecificationId ?? 0),
      pageSpecification: new FormGroup({
        pageId: new FormControl(per?.pageId ?? null),
        userControllerName: new FormControl(per?.userControllerName ?? ''),
        progControllerName: new FormControl(per?.progControllerName ?? ''),
        pageCategory: new FormControl(per?.pageCategory ?? null),
        canSee: new FormControl(per?.canSee ?? false),
        canSave: new FormControl(per?.canSave ?? false),
        canEdit: new FormControl(per?.canEdit ?? false),
        canDelete: new FormControl(per?.canDelete ?? false),
        canPrint: new FormControl(per?.canPrint ?? false),
        canSearch: new FormControl(per?.canSearch ?? false),
        doAll: new FormControl(per?.doAll ?? false),
        isRowShown: new FormControl(per?.isRowShown ?? true),
      })
    });
  }


  initUserPermissionsFormGroup(per: any): FormGroup {
    return new FormGroup({
      keyId: new FormControl(per?.keyId ?? 0),
      permissionsSpecificationId: new FormControl(per?.permissionsSpecificationId ?? 0),
      userId: new FormControl(per?.userId ?? ""),
      displayName: new FormControl(per?.displayName ?? ""),
      userPolicyName: new FormControl(per?.userPolicyName ?? "")
    });
  }
  initPermissionForm(per: any): FormGroup {
    return new FormGroup({
      keyId: new FormControl(per?.keyId ?? 0, Validators.required),
      profileName: new FormControl(per?.profileName ?? '', [Validators.required, Validators.pattern("^(?!\\s+$).+")]),
      permissionsSpecificationDetails: new FormArray([]),
      userPermissions: new FormArray([])
    });
  }

  openNew(focusInProfileNameInput: boolean = true): void {
    this.permssionsSpecForm = this.initPermissionForm(null);
    this.getUsersWithoutPermissionsData();
    this.usersHavePermissions = [];
    //this.permissions = [];
    this.getInitialPermissionsFornewAddition();
    this.app_shared_permissions.data = this.permissions;
    if (focusInProfileNameInput) {
      const inputElement = document.getElementById('profileName');
      if (inputElement) {
        inputElement.focus();
      }
    }
    this.app_shared_permissions.hideBtnEdit = true;
  }
  getPermissionMasterAndDetailsToEdit() {
    let permissionMasterId = this.app_shared_permissions.permissionMasterToEdit;
    if (permissionMasterId != undefined) {
      this.permissionsSpecificationServ.getPermissionMasterById(permissionMasterId).subscribe((data) => {
        this.permssionsSpecForm = this.initPermissionForm(data);
        this.permissions = data.pageSpecifications;
        this.app_shared_permissions.permissionsDialog = false;

      });
      this.permissionsSpecificationServ.getUserHavePermissionsById(permissionMasterId).subscribe((data) => {
        this.usersHavePermissions = data;
      });
      this.getUsersWithoutPermissionsData();
    }
  };



  setPermissionsDetailsAnduserPermissiosnsDetailsToItsDetailsForm() {
    this.app_shared_permissions.data.forEach((per, index) =>
      this.getPermissionsDetailForm().setControl(index, this.initPermissionsFormGroup(per)));

    this.app_shared_permissions.usersHavePermissions.forEach((per, index) => this.getUserPermissionsForm().setControl(index, this.initUserPermissionsFormGroup(per)));
  }

  saveNewPermissionMasterWithDetails() {
    this.setPermissionsDetailsAnduserPermissiosnsDetailsToItsDetailsForm();
    if (this.permssionsSpecForm.valid) {

      this.permssionsSpecForm.get('keyId')?.setValue(0);
      this.getPermissionsDetailForm().controls.forEach(s => {
        s.get('permissionsSpecificationId')?.setValue(0);
        s.get('keyId')?.setValue(0);
      })

      this.permissionsSpecificationServ.saveNewPermissionsSpecData(this.permssionsSpecForm).subscribe((response) => {
        this.messageService.add({
          severity: 'success', summary: this._localizeServ.getLabelValue('lbl_success')
          , detail: this._localizeServ.getLabelValue('lbl_missionCompletedSuccessfully')
        });
        this.openNew(false);
      });
    }
    else {
      this.permssionsSpecForm.markAllAsTouched();
      console.log(this.permssionsSpecForm.value);
    }
  }
  updatePermissionMasterAndDetails() {
    this.setPermissionsDetailsAnduserPermissiosnsDetailsToItsDetailsForm();
    if (this.permssionsSpecForm.valid) {
      this.permissionsSpecificationServ.updatePermissionsSpecData(this.permssionsSpecForm).subscribe((response) => {
        this.messageService.add({
          severity: 'success', summary: this._localizeServ.getLabelValue('lbl_success')
          , detail: this._localizeServ.getLabelValue('lbl_missionCompletedSuccessfully')
        });
        this.openNew(false);
      });
    }
    else {
      this.permssionsSpecForm.markAllAsTouched();
      console.log(this.permssionsSpecForm.value);
    }
  }
  deletePermissionMasterAndDetals() {
    if (this.app_shared_permissions.permissionMasterToDelete != null) {
      this.permissionsSpecificationServ.deletePermissionsSpecDataWithDetails(this.app_shared_permissions.permissionMasterToDelete).subscribe((res) => {
        this.messageService.add({ severity: 'success', summary: this._localizeServ.getLabelValue('lbl_success'), detail: this._localizeServ.getLabelValue('lbl_missionCompletedSuccessfully'), life: 3000 });
        this.app_shared_permissions.onPageChange(this.app_shared_permissions.paginatorRefPermissionsMaster.paginatorRef);
        this.openNew(false);
      });
    }
  }
  importPermissionToSaveNewOne() {
    this.getPermissionMasterAndDetailsToEdit();
  }
  printPermissionsWithDetails() {
    this.getPermissionsDetailForm().clear();
    this.app_shared_permissions.data.forEach((per, index) => {
      if (per.isRowShown == true) {
        this.getPermissionsDetailForm().setControl(index, this.initPermissionsFormGroup(per));
      }
    });

    this.getUserPermissionsForm().clear();

    this.app_shared_permissions.usersHavePermissions.forEach((user, index) => {
      this.getUserPermissionsForm().setControl(index, this.initUserPermissionsFormGroup(user));
    });

    if (this.permssionsSpecForm.valid)
      this._printServ.generateReportWithBody("PermissionsSpecification/printPermissionsWithDetails", this.permssionsSpecForm.value
        , this._localizeServ.getLabelValue('lbl_specifyPermissionsReport'));
    else { this.permssionsSpecForm.markAllAsTouched(); console.log(this.permssionsSpecForm.value); }
  }

}
