import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CheckUserPermissionService } from '../../../../services/users/permissions/check-user-permission.service';
import { CustomConfirmDialogComponent } from '../../customConfirmDialogComponent/custom-confirm-dialog/custom-confirm-dialog.component';
import { LocalizeService } from '../../../../services/localize/localize.service';

@Component({
  selector: 'app-custom-delete-btn',
  standalone: true,
  imports: [ButtonModule, CustomConfirmDialogComponent],
  templateUrl: './custom-delete-btn.component.html',
  styleUrl: './custom-delete-btn.component.scss'
})
export class CustomDeleteBtnComponent {
  @Output() onBtnDeleteClick: EventEmitter<any> = new EventEmitter();
  @Input() ControllerName:string = '';
  @ViewChild('confirmDialog') confirmDialog!:CustomConfirmDialogComponent;
  constructor(private checkUserPermissionServ:CheckUserPermissionService)
  {
  }
  onDelete()
  { 
    
    this.checkUserPermissionServ.check(this.ControllerName, 2).subscribe((res) => {
      if (!res)
      {
        this.confirmDialog.showDialog('lbl_noPermissionForThisEvent','lbl_warning','','lbl_Ok' , false);
      }
      else{
        this.onBtnDeleteClick.emit();
      }
    });
  }
}
