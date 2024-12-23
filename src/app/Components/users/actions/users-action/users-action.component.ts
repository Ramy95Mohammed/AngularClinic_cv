import { Component, OnInit, ViewChild } from '@angular/core';
import { ImportsModule } from '../../../../app/imports';
import { CustomDeleteBtnComponent } from "../../../customComponents/customDeleteBtn/custom-delete-btn/custom-delete-btn.component";
import { CustomNewBtnComponent } from "../../../customComponents/customNewBtn/custom-new-btn/custom-new-btn.component";
import { CustomPrintBtnComponent } from "../../../customComponents/customPrintBtn/custom-print-btn/custom-print-btn.component";
import { LocalizeService } from '../../../../services/localize/localize.service';
import { SharedDataService } from '../../../../services/sharedData/shared-data.service';
import { UsersActionsService } from '../../../../services/users/usersActions/users-actions.service';
import { Paginator } from 'primeng/paginator';
import { CheckboxChangeEvent } from 'primeng/checkbox';
import { CustomConfirmDialogComponent } from "../../../customComponents/customConfirmDialogComponent/custom-confirm-dialog/custom-confirm-dialog.component";
import { ConfirmDialog } from 'primeng/confirmdialog';
import { MessageService } from 'primeng/api';
import { Title } from '@angular/platform-browser';
import { PrintService } from '../../../../services/printingservice/print.service';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CustomSearchFilterInputComponent } from "../../../customComponents/customSearchFilterInput/custom-search-filter-input/custom-search-filter-input.component";
import { CustomPaginatorFilterSearchComponent } from "../../../customComponents/customPaginatorFilterSearch/custom-paginator-filter-search/custom-paginator-filter-search.component";
import { CustomSearchFilterDropDownComponent } from "../../../customComponents/customSearchFilterDropDown/custom-search-filter-drop-down/custom-search-filter-drop-down.component";
import { CustomCalendarFilterSearchComponent } from "../../../customComponents/customCalendarFilterSearch/custom-calendar-filter-search/custom-calendar-filter-search.component";

@Component({
  selector: 'app-users-action',
  standalone: true,
  imports: [ImportsModule, CustomDeleteBtnComponent, CustomNewBtnComponent, CustomPrintBtnComponent, CustomConfirmDialogComponent, CustomSearchFilterInputComponent, CustomPaginatorFilterSearchComponent, CustomSearchFilterDropDownComponent, CustomCalendarFilterSearchComponent],
  templateUrl: './users-action.component.html',
  styleUrl: './users-action.component.scss'
})
export class UsersActionComponent implements OnInit{
  _localizeServe:LocalizeService;
  totalRecords:number = 10;
  usersActionsData:any[]=[];
  userActionsProcessTypesData:any[]=[];
  txtSearch:string="";

  printAll:boolean = false;
  userActionForm:FormGroup;
  ControllerName:string='UserActions';
  usersActionsDataFormArray:FormArray<any>;
  @ViewChild('paginatorRef') paginatorRef!:CustomPaginatorFilterSearchComponent;
  @ViewChild('actionProcessTypeDropDown') actionProcessTypeDropDown!:CustomSearchFilterDropDownComponent;
  @ViewChild('ConfirmDialog') ConfirmDialog!:CustomConfirmDialogComponent;
  @ViewChild('txtCustomSearch') txtCustomSearch!:CustomSearchFilterInputComponent;
  @ViewChild('dateFromForUserActionUpdateDate') dateFromForUserActionUpdateDate!:CustomCalendarFilterSearchComponent;
  @ViewChild('dateToForUserActionUpdateDate') dateToForUserActionUpdateDate!:CustomCalendarFilterSearchComponent;
  constructor(localoizeServ:LocalizeService , private sharedServ:SharedDataService , private usersActionsServ:UsersActionsService,private messageService: MessageService,private titleService:Title ,private printServ:PrintService)
  {
   this._localizeServe = localoizeServ;
   this.userActionForm = this.inituserActionForm();
   this.usersActionsDataFormArray = new FormArray<any>([this.initUsersActionsDataFormArray(null)])
  }
  ngOnInit(): void {
    let title=this._localizeServe.getLabelValue('lbl_usersActions');
    if( title !='')
    this.titleService.setTitle(title );
    this.getUserActionsProcessTypesData();
    this.getUsersActionsData(1,10,this.txtSearch , null );
    
  }

  getUserActionsProcessTypesData()
  {
    this.sharedServ.getUserActionsProcessTypesData().subscribe((data)=>{
      this.userActionsProcessTypesData = data;
    });
  }

  inituserActionForm():FormGroup
  {
    return new FormGroup({
      printAll:new FormControl(),
      usersActionsData:new FormArray<any>([])
    });
  }
  
  getusersActionsDataFromArray():FormArray
  {
    return this.userActionForm.get('usersActionsData') as FormArray;
  }

  initUsersActionsDataFormArray(act:any):FormGroup
  {
         return new FormGroup({
          keyId:new FormControl(act?.keyId??0),
          controllerName:new FormControl(act?.controllerName??""),
          pageId:new FormControl(act?.pageId??0),
          actionName:new FormControl(act?.actionName??""),
          entityState:new FormControl(act?.entityState??0),
          displayName:new FormControl(act?.displayName??""),
          entityId:new FormControl(act?.entityId??0),
          tableName:new FormControl(act?.tableName??""),
          pageArName:new FormControl(act?.pageArName??""),  
          actionToDelete:new FormControl(act?.actionToDelete??false),
          formattedUpdatedTime:new FormControl(act?.formattedUpdatedTime??""),
          formattedUpdatedDate:new FormControl(act?.formattedUpdatedDate??""),
          updatedTime:new FormControl(act?.updatedTime??null),
          updateDate:new FormControl(act?.updateDate??null)
         })
  }

  getUsersActionsData(pageIndex:number , pageSize:number,searchValue:string|null,sort:string | null,entityState:any = null,dateFrom:any = null
    , dateTo:any = null)
    {
        this.usersActionsServ.getUsersActionsData(pageIndex , pageSize , searchValue , sort , entityState , dateFrom , dateTo).subscribe((response)=>{
         this.usersActionsData = response.data;
         this.totalRecords = response.count;
         //console.log(typeof(this.usersActionsData[0].formattedUpdatedTime));
          this.convertCSharpDateFormatToJsFormat();
        });
    }

    convertCSharpDateFormatToJsFormat()
    {
      this.usersActionsData.forEach(action => {
        const updateDateString = action.updateDate;
        
        // Extract time from the full DateTime string (HH:mm:ss)
        const timeString = updateDateString.substring(11, 19);  // Extracts "HH:mm:ss"
        
        // Split the time string into hours, minutes, and seconds
        const timeParts = timeString.split(':');
        const hours = parseInt(timeParts[0], 10);
        const minutes = parseInt(timeParts[1], 10);
        const seconds = parseInt(timeParts[2], 10);
  
        // Create a Date object with a placeholder date (e.g., 1970-01-01) and the extracted time
        action.formattedUpdatedTime = new Date(1970, 0, 1, hours, minutes, seconds);
      });
    }
    
    getDataOnParamsChanges()
    {
      let userActionPaginator = this.paginatorRef.paginatorRef;
      let pageIndex:number=0;
      if(userActionPaginator.first==0)pageIndex=userActionPaginator.first+1;
      else 
      pageIndex = (userActionPaginator.first / userActionPaginator.rows) +1;
      this.getUsersActionsData(pageIndex,userActionPaginator.rows , this.txtCustomSearch.txtSerach , null ,this.actionProcessTypeDropDown.value , this.dateFromForUserActionUpdateDate.value , this.dateToForUserActionUpdateDate.value);           
    }
    checkAllusersActions(event:CheckboxChangeEvent )
    {
        this.usersActionsData.forEach(x=> x.actionToDelete = event.checked);
    }


    checkPrintAllusersActions(event:CheckboxChangeEvent )
    {
        this.printAll = event.checked;
    }

    showConfirmDialog()
    {
       this.ConfirmDialog.showDialog('lbl_sureToDelete' , 'lbl_confirm' , 'lbl_Ok' , 'lbl_cancel');   
    }


    deleteSelectedUsersActions()
    {
      if(this.usersActionsData.filter(u=>u.actionToDelete).length < 1)
      {
      this.messageService.add({ severity:'warn', summary: this._localizeServe.getLabelValue('lbl_warning')
      ,detail: this._localizeServe.getLabelValue('lbl_noSelectedData')});
      return;
      }
      let selectedUsersActions = this.usersActionsData.filter(u=>u.actionToDelete);
      this.usersActionsServ.deleteSelectedUsersActions(selectedUsersActions).subscribe((data)=>{
        this.messageService.add({ severity:'success', summary: this._localizeServe.getLabelValue('lbl_success')
        ,detail: this._localizeServe.getLabelValue('lbl_missionCompletedSuccessfully')});

        this.getDataOnParamsChanges();
      });
    }
    clearSearchData()
    {

      this.txtSearch="";
      this.actionProcessTypeDropDown.value = null;
      this.dateFromForUserActionUpdateDate.value = null;
      this.dateToForUserActionUpdateDate.value= null;
     this.getDataOnParamsChanges()
    }

    printUsersActionData()
    {
      this.userActionForm.get('printAll')?.setValue(this.printAll);
      
      this.usersActionsData.forEach((userAction, index) => {
        this.getusersActionsDataFromArray().setControl(index , this.initUsersActionsDataFormArray(userAction));
      });
      
      this.printServ.generateReportWithBody("UserActions" , this.userActionForm.value , this._localizeServe.getLabelValue('lbl_usersActionsReport'));
    }
}
