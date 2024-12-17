import { Component, OnInit, ViewChild } from '@angular/core';
import { ImportsModule } from '../../../app/imports';
import { SectionsService } from '../../../services/sections/sections.service';
import { LocalizeService } from '../../../services/localize/localize.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { CustomDialogComponent } from '../../customComponents/customDialogComponent/custom-dialog/custom-dialog.component';
import { CustomConfirmDialogComponent } from "../../customComponents/customConfirmDialogComponent/custom-confirm-dialog/custom-confirm-dialog.component";
import { CustomEditBtnComponent } from '../../customComponents/customEditBtn/custom-edit-btn/custom-edit-btn.component';
import { CustomDeleteBtnComponent } from '../../customComponents/customDeleteBtn/custom-delete-btn/custom-delete-btn.component';
import { CustomNewBtnComponent } from "../../customComponents/customNewBtn/custom-new-btn/custom-new-btn.component";
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [ImportsModule, CustomDialogComponent, CustomConfirmDialogComponent, CustomEditBtnComponent, CustomDeleteBtnComponent, CustomNewBtnComponent], 
templateUrl: './section.component.html',
  styleUrl: './section.component.scss'
})
export class SectionComponent implements OnInit {

  sections:any[] = [];
 _localizeServe:LocalizeService;
 first = 0;
 rows = 10;
 txtSearch:string=""
 totalRecords:number = 10;
 sectionsDialog: boolean = false;
@ViewChild('sectionCustomDialog') sectionCustomDialog!:CustomDialogComponent;
@ViewChild('customDeleteDialog') customDeleteDialog!: CustomConfirmDialogComponent; 
 
  constructor(private sectionsServ:SectionsService , localizeServ:LocalizeService ,private titleService:Title )
  {
      this._localizeServe = localizeServ;
  }
  ngOnInit(): void {
    let title=this._localizeServe.getLabelValue('lbl_showSections');
    if( title !='')
    this.titleService.setTitle(title );
   this.getSectionsData(1 , 10 , "" , null);
  }

  getSectionsData(pageIndex:number , pageSize:number,searchValue:string,sort:string | null)
  {
    this.sectionsServ.getSectionsData(pageIndex,pageSize,searchValue,sort).subscribe((data)=>{
      this.sections = data.data;
      this.totalRecords = data.count;
    },(error)=>{});
  }
  onPageChange(event:any)
  {
    let pageIndex:number=0;
    if(event.first==0)pageIndex=event.first+1;
    else 
    pageIndex = (event.first / event.rows) +1;
     this.getSectionsData(pageIndex,event.rows , this.txtSearch , null);     
     
     console.log(event.rows);
  } 

  openNew() {   
    this.sectionCustomDialog.saveOrEdit = true;
    this.sectionCustomDialog.header = this._localizeServe.getLabelValue('lbl_addSection');
    this.sectionsDialog = true;
}

hideDialog() {
  this.sectionsDialog = false;
}

deleteProduct() {  

  this.customDeleteDialog.showDialog('lbl_sureToDelete' , 'lbl_confirm' , 'lbl_yes' , 'lbl_no');
  
}
      editProduct() {
        this.sectionCustomDialog.header = this._localizeServe.getLabelValue('lbl_editSection');
        this.sectionCustomDialog.saveOrEdit = false;
        this.sectionsDialog = true;
      }

      // Define the method that should be executed when "Save" is clicked
  onSave(): void {
    console.log('Save button clicked from Parent! Save');
    // Add any additional logic for Save here
  }

  onEdit(): void {
    console.log('Save button clicked from Parent! Edit');
    // Add any additional logic for Save here
  }
  test()
  {
    console.log('Delete from parent');
  }
      
}
