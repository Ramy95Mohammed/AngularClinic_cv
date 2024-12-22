import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ImportsModule } from '../../../../app/imports';
import { CheckUserPermissionService } from '../../../../services/users/permissions/check-user-permission.service';
import { CustomConfirmDialogComponent } from "../../customConfirmDialogComponent/custom-confirm-dialog/custom-confirm-dialog.component";

@Component({
  selector: 'app-custom-search-filter-drop-down',
  standalone: true,
  imports: [ImportsModule, CustomConfirmDialogComponent],
  templateUrl: './custom-search-filter-drop-down.component.html',
  styleUrl: './custom-search-filter-drop-down.component.scss'
})
export class CustomSearchFilterDropDownComponent {
  @Input() ControllerName:string = '';
  @Input() dropDownData:any[]=[];
  @Input() optionLabel:any;
  @Input() optionValue:any;
  @Input() inputId:string='';
  @Input() placeholder:string='';
  @Input() labelPlaceholder:string='';
  @Input() showClear:boolean=false;
  dropDownValue:any;
  @Output() onDropDownValueChanged: EventEmitter<any> = new EventEmitter();
  @ViewChild('confirmDialog') confirmDialog!:CustomConfirmDialogComponent;
  constructor(private checkUserPermissionServ:CheckUserPermissionService)
  {
    
  }
  onChange()
    {
      this.checkUserPermissionServ.check(this.ControllerName, 4).subscribe((res) => {
        if (!res)
        {
          this.confirmDialog.showDialog('lbl_noPermissionForThisEvent','lbl_warning','','lbl_Ok' , false);
        }
        else{
          this.onDropDownValueChanged.emit();
        }
      }); 
    }
}
