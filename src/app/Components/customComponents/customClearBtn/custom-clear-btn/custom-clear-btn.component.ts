import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CustomConfirmDialogComponent } from '../../customConfirmDialogComponent/custom-confirm-dialog/custom-confirm-dialog.component';
import { TooltipModule } from 'primeng/tooltip';
import { LocalizeService } from '../../../../services/localize/localize.service';
import { CheckUserPermissionService } from '../../../../services/users/permissions/check-user-permission.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-custom-clear-btn',
  standalone: true,
  imports: [ButtonModule, CustomConfirmDialogComponent,TooltipModule],
  templateUrl: './custom-clear-btn.component.html',
  styleUrl: './custom-clear-btn.component.scss'
})
export class CustomClearBtnComponent {
  _localzieServ:LocalizeService;
  constructor(private checkUserPermissionServ:CheckUserPermissionService , localizeServ:LocalizeService)
  {
    this._localzieServ = localizeServ;
  }
  @Output() onBtnClearClick: EventEmitter<any> = new EventEmitter();
  @Input() icon:string = 'pi pi-search';
  @Input() label:string = '';
  @Input() severity:any = 'success';
  @Input() rounded:boolean = true;
  @Input() text:boolean = false;
  @Input() outlined:boolean = true;
  @Input() ControllerName:string = '';
  @Input() btnClass:string = 'mr-2';
  @Input() btnStyleClass:string = '';
  @ViewChild('confirmDialog') confirmDialog!:CustomConfirmDialogComponent;

  onClear()
{
  this.checkUserPermissionServ.check(this.ControllerName, 4).subscribe((res) => {
    if (!res)
    {
      this.confirmDialog.showDialog('lbl_noPermissionForThisEvent','lbl_warning','','lbl_Ok' , false);
    }
    else{
      this.onBtnClearClick.emit();
    }
  }); 
}

}
