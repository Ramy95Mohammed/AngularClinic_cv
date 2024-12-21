import { Component, EventEmitter, Input, Output, ViewChild, input } from '@angular/core';
import { Button, ButtonModule } from 'primeng/button';
import { CheckUserPermissionService } from '../../../../services/users/permissions/check-user-permission.service';
import { CustomConfirmDialogComponent } from '../../customConfirmDialogComponent/custom-confirm-dialog/custom-confirm-dialog.component';

@Component({
  selector: 'app-custom-edit-btn',
  standalone: true,
  imports: [ButtonModule, CustomConfirmDialogComponent],
  templateUrl: './custom-edit-btn.component.html',
  styleUrl: './custom-edit-btn.component.scss'
})
export class CustomEditBtnComponent {
  constructor(private checkUserPermissionServ:CheckUserPermissionService)
  {}
  @Output() onBtnEditClick: EventEmitter<any> = new EventEmitter();
  @Input() icon:string = 'pi pi-pencil';
  @Input() label:string = '';
  @Input() severity:any = 'success';
  @Input() rounded:boolean = true;
  @Input() text:boolean = false;
  @Input() outlined:boolean = true;
  @Input() ControllerName:string = '';
  @ViewChild('confirmDialog') confirmDialog!:CustomConfirmDialogComponent;
  onEdit()
  {
    this.checkUserPermissionServ.check(this.ControllerName, 1).subscribe((res) => {
      if (!res)
      {
        this.confirmDialog.showDialog('lbl_noPermissionForThisEvent','lbl_warning','','lbl_Ok' , false);
      }
      else{
        this.onBtnEditClick.emit();
      }
    });
   
  }
}
