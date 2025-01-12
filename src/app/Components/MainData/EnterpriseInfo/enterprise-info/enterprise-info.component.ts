import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalizeService } from '../../../../services/localize/localize.service';
import { Title } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { ImportsModule } from '../../../../app/imports';
import { CustomNewBtnComponent } from "../../../customComponents/customNewBtn/custom-new-btn/custom-new-btn.component";
import { CustomSaveBtnComponent } from "../../../customComponents/customSaveBtn/custom-save-btn/custom-save-btn.component";
import { CustomPrintBtnComponent } from "../../../customComponents/customPrintBtn/custom-print-btn/custom-print-btn.component";
import { KeyFilterModule } from 'primeng/keyfilter';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EnterpriseInfoService } from '../../../../services/mainData/enterprise-info.service';
import { HttpHeaders } from '@angular/common/http';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';
import { CustomDeleteBtnComponent } from "../../../customComponents/customDeleteBtn/custom-delete-btn/custom-delete-btn.component";
import { CustomConfirmDialogComponent } from "../../../customComponents/customConfirmDialogComponent/custom-confirm-dialog/custom-confirm-dialog.component";
import e from 'express';
import { PrintService } from '../../../../services/printingservice/print.service';
import { environment } from '../../../../../environments/environment.development';
@Component({
  selector: 'app-enterprise-info',
  standalone: true,
  imports: [ImportsModule, CustomSaveBtnComponent, CustomPrintBtnComponent, KeyFilterModule, CustomDeleteBtnComponent, CustomConfirmDialogComponent],
  templateUrl: './enterprise-info.component.html',
  styleUrl: './enterprise-info.component.scss'
})
export class EnterpriseInfoComponent implements OnInit {
  _localizeServe: LocalizeService;
  ControllerName: string = 'EnterpriseInfo';
  @ViewChild('ImageFile') ImageFile!: FileUpload;
  uploadedFiles: any[] = [];
  downloadedFiles: any[] = [];
  enterPriseInfoForm: FormGroup;
  imageLogofileNameToDelete: string | null = null;
  @ViewChild('confirmDialog') confirmDialog!: CustomConfirmDialogComponent;
  constructor(localizeServ: LocalizeService, private titleService: Title,
    private messageService: MessageService, private enterpriseInfoServ: EnterpriseInfoService, private _printServ: PrintService) {
    this._localizeServe = localizeServ;

    this.enterPriseInfoForm = this.initEnterPriseInfoForm(null);

  }



  initEnterPriseInfoForm(info: any): FormGroup {
    return new FormGroup({
      keyId: new FormControl(info?.keyId ?? 0, Validators.required),
      name: new FormControl(info?.name ?? '', [Validators.required, Validators.pattern("^(?!\\s+$).+")]),
      foreignName: new FormControl(info?.foreignName ?? '', [Validators.required, Validators.pattern("^(?!\\s+$).+")]),
      phone: new FormControl(info?.phone ?? '', [Validators.required, Validators.pattern("^(?!\\s+$).+")]),
      groundTel: new FormControl(info?.groundTel ?? '', [Validators.required, Validators.pattern("^(?!\\s+$).+")]),
      email: new FormControl(info?.email ?? '', [Validators.required, Validators.email]),
      address: new FormControl(info?.address ?? '', [Validators.required, Validators.pattern("^(?!\\s+$).+")]),
      commercialRegister: new FormControl(info?.commercialRegister ?? ''),
      taxNumber: new FormControl(info?.taxNumber ?? ''),
    });
  }

  ngOnInit(): void {
    let title = this._localizeServe.getLabelValue('lbl_enterpriseInfo');
    if (title != '')
      this.titleService.setTitle(title);
    this.getEnterpriseInfoData();
  }


  getEnterpriseInfoData() {
    this.enterpriseInfoServ.getEnterpriseInfo().subscribe((res) => {
      if (res != null) {
        this.enterPriseInfoForm = this.initEnterPriseInfoForm(res);


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

      }
    });
  }


  onSelectFile(event: FileSelectEvent) {
    this.uploadedFiles = [];
    for (let file of event.files) {
      // this.enterPriseInfoForm.get('imageData')?.setValue(file);
      this.uploadedFiles.push(file);
    }


  }
  onClearFile() {
    this.uploadedFiles = [];
  }
  appendFormData(formData: FormData) {
    formData.append('keyId', this.enterPriseInfoForm.get('keyId')?.value);
    formData.append('name', this.enterPriseInfoForm.get('name')?.value);
    formData.append('foreignName', this.enterPriseInfoForm.get('foreignName')?.value);
    formData.append('phone', this.enterPriseInfoForm.get('phone')?.value);
    formData.append('groundTel', this.enterPriseInfoForm.get('groundTel')?.value);
    formData.append('email', this.enterPriseInfoForm.get('email')?.value);
    formData.append('address', this.enterPriseInfoForm.get('address')?.value);
    formData.append('commercialRegister', this.enterPriseInfoForm.get('commercialRegister')?.value);
    formData.append('taxNumber', this.enterPriseInfoForm.get('taxNumber')?.value);
    if (this.uploadedFiles.length > 0) {
      formData.append('imageFile', this.uploadedFiles[0], this.uploadedFiles[0].name);

    }
  }
  onSave() {
    if (this.enterPriseInfoForm.valid) {
      const formData = new FormData();

      this.appendFormData(formData);



      //  const httpOptions = { headers: new HttpHeaders().set('Content-Type', 'multipart/form-data; boundary=RECORD_BOUNDARY')
      // };
      const httpOptions = {
        headers: new HttpHeaders()
        // No Content-Type header is needed when sending FormData
      };

      this.enterpriseInfoServ.saveEnterpriseInfoData(formData, httpOptions).subscribe((res) => {
        this.getEnterpriseInfoData();
        this.messageService.add({
          severity: 'success', summary: this._localizeServe.getLabelValue('lbl_success')
          , detail: this._localizeServe.getLabelValue('lbl_missionCompletedSuccessfully')
        });

      });
    }
    else {
      console.log('form value is error');
      this.enterPriseInfoForm.markAllAsTouched();
    }

  }
  setPathOfLogoToDelete(fileName: string) {
    this.imageLogofileNameToDelete = fileName;
    this.confirmDialog.showDialog('lbl_sureToDelete', 'lbl_confirm', 'lbl_yes', 'lbl_no');
  }
  deleteLogoFile() {
    this.enterpriseInfoServ.deleteLogoFile(this.imageLogofileNameToDelete!).subscribe((res) => {
      this.messageService.add({
        severity: 'success', summary: this._localizeServe.getLabelValue('lbl_success')
        , detail: this._localizeServe.getLabelValue('lbl_missionCompletedSuccessfully')
      });
      this.getEnterpriseInfoData();
      this.imageLogofileNameToDelete = null;
      this.uploadedFiles = [];
    });
  }

  printEnterPriseData() {
    if (this.enterPriseInfoForm.valid) {
      const formData = new FormData();

      this.appendFormData(formData);
      const httpOptions = {
        headers: new HttpHeaders()
        // No Content-Type header is needed when sending FormData
      };
      this._printServ.generateReportWithBodyByFormData('EnterpriseInfo/print',formData,httpOptions.headers,this._localizeServe.getLabelValue('lbl_printEnterpriseData'));
    } else {
      console.log('form value is error');
      this.enterPriseInfoForm.markAllAsTouched();
    }
  }


}
