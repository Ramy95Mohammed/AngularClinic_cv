import { Component, OnInit } from '@angular/core';
import { LocalizeService } from '../../../../services/localize/localize.service';
import { Title } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { ImportsModule } from '../../../../app/imports';
import { CustomNewBtnComponent } from "../../../customComponents/customNewBtn/custom-new-btn/custom-new-btn.component";
import { CustomSaveBtnComponent } from "../../../customComponents/customSaveBtn/custom-save-btn/custom-save-btn.component";
import { CustomPrintBtnComponent } from "../../../customComponents/customPrintBtn/custom-print-btn/custom-print-btn.component";
import { KeyFilterModule } from 'primeng/keyfilter';
@Component({
  selector: 'app-enterprise-info',
  standalone: true,
  imports: [ImportsModule, CustomNewBtnComponent, CustomSaveBtnComponent, CustomPrintBtnComponent,KeyFilterModule], 
  templateUrl: './enterprise-info.component.html',
  styleUrl: './enterprise-info.component.scss'
})
export class EnterpriseInfoComponent implements OnInit{
  _localizeServe:LocalizeService;
  ControllerName:string='EnterpriseInfo';
  uploadedFiles: any[] = [];
  constructor( localizeServ: LocalizeService, private titleService: Title,
    private messageService: MessageService) {
    this._localizeServe = localizeServ;    
  }
  ngOnInit(): void {
    let title = this._localizeServe.getLabelValue('lbl_enterpriseInfo');
    if (title != '')
      this.titleService.setTitle(title);
  }
  onUpload(event:any) {
    alert('s');
    for(let file of event.files) {
        this.uploadedFiles.push(file);
    }

    this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
}
}
