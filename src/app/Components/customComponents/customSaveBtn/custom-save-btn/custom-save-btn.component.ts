import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CheckUserPermissionService } from '../../../../services/users/permissions/check-user-permission.service';
import { CustomConfirmDialogComponent } from "../../customConfirmDialogComponent/custom-confirm-dialog/custom-confirm-dialog.component";
import { TooltipModule } from 'primeng/tooltip';
import { LocalizeService } from '../../../../services/localize/localize.service';
@Component({
  selector: 'app-custom-save-btn',
  standalone: true,
  imports: [ButtonModule, CustomConfirmDialogComponent,TooltipModule],
  templateUrl: './custom-save-btn.component.html',
  styleUrl: './custom-save-btn.component.scss'
})
export class CustomSaveBtnComponent {


  _localzieServ:LocalizeService;
  constructor(private checkUserPermissionServ:CheckUserPermissionService , localizeServ:LocalizeService)
  {
    this._localzieServ = localizeServ;
    this.btnpTooltip = this._localzieServ .getLabelValue('lbl_save');
  }
  @Output() onBtnSaveClick: EventEmitter<any> = new EventEmitter();
  @Input() icon:string = 'pi pi-save';
  @Input() label:string = '';
  @Input() severity:any = 'success';
  @Input() rounded:boolean = true;
  @Input() text:boolean = false;
  @Input() outlined:boolean = true;
  @Input() ControllerName:string = '';
  @Input() styleClass:string = '';
  @Input() btnpTooltip:string =  '';
  @Input() class:string = 'mr-2';
  @ViewChild('confirmDialog') confirmDialog!:CustomConfirmDialogComponent;
  onSave()
  {
    this.checkUserPermissionServ.check(this.ControllerName, 0).subscribe((res) => {
      if (!res)
      {
        this.confirmDialog.showDialog('lbl_noPermissionForThisEvent','lbl_warning','','lbl_Ok' , false);
      }
      else{
        this.onBtnSaveClick.emit();
      }
    });
   
  }
}
