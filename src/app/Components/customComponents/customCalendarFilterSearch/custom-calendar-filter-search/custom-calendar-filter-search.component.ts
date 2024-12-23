import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ImportsModule } from '../../../../app/imports';
import { CheckUserPermissionService } from '../../../../services/users/permissions/check-user-permission.service';
import { CustomConfirmDialogComponent } from "../../customConfirmDialogComponent/custom-confirm-dialog/custom-confirm-dialog.component";
import { Button } from 'primeng/button';

@Component({
  selector: 'app-custom-calendar-filter-search',
  standalone: true,
  imports: [ImportsModule, CustomConfirmDialogComponent],
  templateUrl: './custom-calendar-filter-search.component.html',
  styleUrl: './custom-calendar-filter-search.component.scss'
})
export class CustomCalendarFilterSearchComponent {
  value:any;
  @Output() onValueSelected: EventEmitter<any> = new EventEmitter();
  @ViewChild('confirmDialog') confirmDialog!:CustomConfirmDialogComponent;
  @Input() ControllerName:string = '';
  @Input() dateFormat:string = '';
  @Input() iconDisplay:any = 'input';
  @Input() showButtonBar:boolean = true;
  @Input() showIcon:boolean = true;
  @Input() inputId:string='';
  @Input() labelPlaceholder:string='';

  constructor(private checkUserPermissionServ:CheckUserPermissionService)
  {
    
  }
  onSelectValue()
  {
    this.checkUserPermissionServ.check(this.ControllerName, 4).subscribe((res) => {
      if (!res)
      {
        this.confirmDialog.showDialog('lbl_noPermissionForThisEvent','lbl_warning','','lbl_Ok' , false);
      }
      else{
        this.onValueSelected.emit();
      }
    }); 
  }
}
