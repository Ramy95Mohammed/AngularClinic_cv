import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CheckUserPermissionService } from '../../../../services/users/permissions/check-user-permission.service';
import { CustomConfirmDialogComponent } from '../../customConfirmDialogComponent/custom-confirm-dialog/custom-confirm-dialog.component';
import { LocalizeService } from '../../../../services/localize/localize.service';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-custom-delete-btn',
  standalone: true,
  imports: [ButtonModule, CustomConfirmDialogComponent,TooltipModule],
  templateUrl: './custom-delete-btn.component.html',
  styleUrl: './custom-delete-btn.component.scss'
})
export class CustomDeleteBtnComponent {
  @Output() onBtnDeleteClick: EventEmitter<any> = new EventEmitter();
  @Input() ControllerName:string = ''; 
  @Input() btnClass:string = 'mr-2'; 
  @Input() rounded:boolean = true;
  @Input() text:boolean = false;
  @ViewChild('confirmDialog') confirmDialog!:CustomConfirmDialogComponent;
  _localzieServ:LocalizeService;
  constructor(private checkUserPermissionServ:CheckUserPermissionService , localizeServ:LocalizeService)
  {
    this._localzieServ = localizeServ;
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
