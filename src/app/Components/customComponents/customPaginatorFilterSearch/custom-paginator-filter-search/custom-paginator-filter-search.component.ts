import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ImportsModule } from '../../../../app/imports';
import { CheckUserPermissionService } from '../../../../services/users/permissions/check-user-permission.service';
import { CustomConfirmDialogComponent } from '../../customConfirmDialogComponent/custom-confirm-dialog/custom-confirm-dialog.component';
import { Paginator } from 'primeng/paginator';

@Component({
  selector: 'app-custom-paginator-filter-search',
  standalone: true,
  imports: [ImportsModule, CustomConfirmDialogComponent],
  templateUrl: './custom-paginator-filter-search.component.html',
  styleUrl: './custom-paginator-filter-search.component.scss'
})
export class CustomPaginatorFilterSearchComponent {
  @Output() onPageChange: EventEmitter<any> = new EventEmitter();
  @ViewChild('confirmDialog') confirmDialog!:CustomConfirmDialogComponent;
  @ViewChild('paginatorRef') paginatorRef!:Paginator;
  @Input() ControllerName:string = '';
  @Input() dropdownAppendTo:string = 'body';
  @Input() showCurrentPageReport:boolean = true;
  @Input() currentPageReportTemplate:string = '';
  @Input() totalRecords:number = 10;
  @Input() rows:number = 10;
  @Input() rowsPerPageOptions:any[] = [10, 20, 30,40,50];
  constructor(private checkUserPermissionServ:CheckUserPermissionService)
  {
    
  }
  onPageChanged()
  {
    this.checkUserPermissionServ.check(this.ControllerName, 4).subscribe((res) => {
      if (!res)
      {
        this.confirmDialog.showDialog('lbl_noPermissionForThisEvent','lbl_warning','','lbl_Ok' , false);
      }
      else{
        this.onPageChange.emit();
      }
    }); 
  }
}
