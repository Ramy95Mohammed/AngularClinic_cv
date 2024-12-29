import { Component, OnInit, ViewChild } from '@angular/core';
import { ImportsModule } from '../../../../app/imports';
import { SectionsService } from '../../../../services/sections/sections.service';
import { LocalizeService } from '../../../../services/localize/localize.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { CustomDialogComponent } from '../../../customComponents/customDialogComponent/custom-dialog/custom-dialog.component';
import { CustomConfirmDialogComponent } from "../../../customComponents/customConfirmDialogComponent/custom-confirm-dialog/custom-confirm-dialog.component";
import { CustomEditBtnComponent } from '../../../customComponents/customEditBtn/custom-edit-btn/custom-edit-btn.component';
import { CustomDeleteBtnComponent } from '../../../customComponents/customDeleteBtn/custom-delete-btn/custom-delete-btn.component';
import { CustomNewBtnComponent } from "../../../customComponents/customNewBtn/custom-new-btn/custom-new-btn.component";
import { Title } from '@angular/platform-browser';
import { CustomPaginatorFilterSearchComponent } from "../../../customComponents/customPaginatorFilterSearch/custom-paginator-filter-search/custom-paginator-filter-search.component";
import { CustomSearchFilterInputComponent } from "../../../customComponents/customSearchFilterInput/custom-search-filter-input/custom-search-filter-input.component";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomClearBtnComponent } from "../../../customComponents/customClearBtn/custom-clear-btn/custom-clear-btn.component";
import { CustomPrintBtnComponent } from "../../../customComponents/customPrintBtn/custom-print-btn/custom-print-btn.component";
import { PrintService } from '../../../../services/printingservice/print.service';
import { json } from 'stream/consumers';
import { stringify } from 'querystring';

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [ImportsModule, CustomDialogComponent, CustomConfirmDialogComponent, CustomEditBtnComponent, CustomDeleteBtnComponent, CustomNewBtnComponent, CustomPaginatorFilterSearchComponent, CustomSearchFilterInputComponent, CustomClearBtnComponent, CustomPrintBtnComponent],
  templateUrl: './section.component.html',
  styleUrl: './section.component.scss'
})
export class SectionComponent implements OnInit {
  ControllerName: string = 'Sections';
  sections: any[] = [];
  _localizeServe: LocalizeService;
  first = 0;
  rows = 10;
  txtSearch: string = ""
  totalRecords: number = 10;
  sectionsDialog: boolean = false;
  sectionKeyId: number | null = null;
  printAll:boolean = false;
  @ViewChild('sectionCustomDialog') sectionCustomDialog!: CustomDialogComponent;
  @ViewChild('customDeleteDialog') customDeleteDialog!: CustomConfirmDialogComponent;
  @ViewChild('paginatorRef') paginatorRef!: CustomPaginatorFilterSearchComponent;
  sectionForm: FormGroup;

  constructor(private sectionsServ: SectionsService, localizeServ: LocalizeService, private titleService: Title,
    private messageService: MessageService,private printServ:PrintService) {
    this._localizeServe = localizeServ;
    this.sectionForm = this.initsectionForm(null);
  }
  ngOnInit(): void {
    let title = this._localizeServe.getLabelValue('lbl_showSections');
    if (title != '')
      this.titleService.setTitle(title);
    this.getSectionsData(1, 10, "", null);
  }

  getSectionsData(pageIndex: number, pageSize: number, searchValue: string, sort: string | null) {
    this.sectionsServ.getSectionsData(pageIndex, pageSize, searchValue, sort).subscribe((data) => {
      this.sections = data.data;
      this.totalRecords = data.count;
    }, (error) => { });
  }


  initsectionForm(section: any): FormGroup {
    return new FormGroup({
      keyId: new FormControl(section?.keyId ?? 0, Validators.required),
      name: new FormControl(section?.name ?? '', [Validators.required, Validators.pattern("^(?!\\s+$).+")])
    })
  }
  getPaginatedData() {
    let pageIndex: number = 0;
    let sectionPaginator = this.paginatorRef.paginatorRef;

    if (sectionPaginator.first == 0) pageIndex = sectionPaginator.first + 1;
    else
      pageIndex = (sectionPaginator.first / sectionPaginator.rows) + 1;
    this.getSectionsData(pageIndex, sectionPaginator.rows, this.txtSearch, null);

  }

  openNew() {
    this.sectionForm = this.initsectionForm(null);
    this.showDialog('lbl_addSection', true);
  }

  hideDialog() {
    this.sectionsDialog = false;
  }

  showConfirmDialog(keyId: number) {
    this.sectionKeyId = keyId;
    this.customDeleteDialog.showDialog('lbl_sureToDelete', 'lbl_confirm', 'lbl_yes', 'lbl_no');
  }


  showDialog(dialogHeader: string, saveOrEdit: boolean = true) {
    this.sectionCustomDialog.header = this._localizeServe.getLabelValue(dialogHeader);
    this.sectionCustomDialog.saveOrEdit = saveOrEdit;
    this.sectionsDialog = true;
  }

  getSectionForEdit(keyId: number) {

    this.sectionsServ.getSectionById(keyId).subscribe((res) => {
      this.sectionForm = this.initsectionForm(res);
      this.showDialog('lbl_editSection', false);
    });

  }

  // Define the method that should be executed when "Save" is clicked
  onSave(): void {
    if (this.sectionForm.valid) {
      this.sectionsServ.saveNewSection(this.sectionForm.value).subscribe((res) => {
        this.messageService.add({
          severity: 'success', summary: this._localizeServe.getLabelValue('lbl_success')
          , detail: this._localizeServe.getLabelValue('lbl_missionCompletedSuccessfully')
        });

        this.hideDialog();
        this.sectionForm = this.initsectionForm(null);
        this.getPaginatedData();
      });
    }
    else {
      this.sectionForm.markAllAsTouched();
    }
  }

  onEdit(): void {
    if (this.sectionForm.valid) {
      this.sectionsServ.editSection(this.sectionForm.value).subscribe((res) => {
        this.messageService.add({
          severity: 'success', summary: this._localizeServe.getLabelValue('lbl_success')
          , detail: this._localizeServe.getLabelValue('lbl_missionCompletedSuccessfully')
        });

        this.hideDialog();
        this.sectionForm = this.initsectionForm(null);
        this.getPaginatedData();
      });
    }
    else {
      this.sectionForm.markAllAsTouched();
    }
  }
  onDelete() {
    if (this.sectionKeyId != null) {
      this.sectionsServ.deleteSection(this.sectionKeyId).subscribe((res) => {
        this.messageService.add({
          severity: 'success', summary: this._localizeServe.getLabelValue('lbl_success')
          , detail: this._localizeServe.getLabelValue('lbl_missionCompletedSuccessfully')
        });

        this.hideDialog();
        this.sectionForm = this.initsectionForm(null);
        this.sectionKeyId = null;
        this.getPaginatedData();
      });
    }
  }
  printSectionsData() {
    let obj = {
      sections:this.sections,
      printAll:this.printAll

    };
    let jsonString = JSON.stringify(obj);    
      this.printServ.generateReportWithBodyWithHeaders('Sections/print', jsonString,this._localizeServe.getLabelValue('lbl_sectionsReport') , {"Content-Type": "application/json" });
  }
}
