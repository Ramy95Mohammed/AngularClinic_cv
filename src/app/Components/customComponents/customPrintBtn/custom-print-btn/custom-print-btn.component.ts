import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CheckUserPermissionService } from '../../../../services/users/permissions/check-user-permission.service';
import { CustomConfirmDialogComponent } from "../../customConfirmDialogComponent/custom-confirm-dialog/custom-confirm-dialog.component";

@Component({
  selector: 'app-custom-print-btn',
  standalone: true,
  imports: [ButtonModule, CustomConfirmDialogComponent],
  templateUrl: './custom-print-btn.component.html',
  styleUrl: './custom-print-btn.component.scss'
})
export class CustomPrintBtnComponent {
  constructor(private checkUserPermissionServ:CheckUserPermissionService)
  {
    
  }
  @Output() onBtnPrintClick: EventEmitter<any> = new EventEmitter();
  @Input() icon:string = 'fa-solid fa-print';
  @Input() label:string = '';
  @Input() severity:any = 'success';
  @Input() rounded:boolean = true;
  @Input() text:boolean = false;
  @Input() outlined:boolean = true;
  @Input() ControllerName:string = '';
  @ViewChild('confirmDialog') confirmDialog!:CustomConfirmDialogComponent;
  onPrint()
  {
    this.checkUserPermissionServ.check(this.ControllerName, 3).subscribe((res) => {
      if (!res)
      {
        this.confirmDialog.showDialog('lbl_noPermissionForThisEvent','lbl_warning','','lbl_Ok' , false);
      }
      else{
        this.onBtnPrintClick.emit();
      }
    });
  
  }
}
