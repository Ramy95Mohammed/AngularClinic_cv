import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CheckUserPermissionService } from '../../../../services/users/permissions/check-user-permission.service';
import { CustomConfirmDialogComponent } from "../../customConfirmDialogComponent/custom-confirm-dialog/custom-confirm-dialog.component";
import { LocalizeService } from '../../../../services/localize/localize.service';
import { TooltipModule } from 'primeng/tooltip';
@Component({
  selector: 'app-custom-search-btn',
  standalone: true,
  imports: [ButtonModule, CustomConfirmDialogComponent,TooltipModule],
  templateUrl: './custom-search-btn.component.html',
  styleUrl: './custom-search-btn.component.scss'
})
export class CustomSearchBtnComponent {
  _localzieServ:LocalizeService;
  constructor(private checkUserPermissionServ:CheckUserPermissionService , localizeServ:LocalizeService)
  {
    this._localzieServ = localizeServ;
  }
  @Output() onBtnSearchClick: EventEmitter<any> = new EventEmitter();
  @Input() icon:string = 'pi pi-search';
  @Input() label:string = '';
  @Input() severity:any = 'success';
  @Input() rounded:boolean = true;
  @Input() text:boolean = false;
  @Input() outlined:boolean = true;
  @Input() btnClass:string = 'mr-2';
  @Input() ControllerName:string = '';

  @ViewChild('confirmDialog') confirmDialog!:CustomConfirmDialogComponent;
  onSearch()
  {
    this.checkUserPermissionServ.check(this.ControllerName, 4).subscribe((res) => {
      if (!res)
      {
        this.confirmDialog.showDialog('lbl_noPermissionForThisEvent','lbl_warning','','lbl_Ok' , false);
      }
      else{
        this.onBtnSearchClick.emit();
      }
    }); 
  }
}
