import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckUserPermissionService } from '../../../../services/users/permissions/check-user-permission.service';
import { CustomConfirmDialogComponent } from "../../customConfirmDialogComponent/custom-confirm-dialog/custom-confirm-dialog.component";
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-custom-search-filter-input',
  standalone: true,
  imports: [FormsModule, CustomConfirmDialogComponent , IconFieldModule ,InputIconModule], 
  templateUrl: './custom-search-filter-input.component.html',
  styleUrl: './custom-search-filter-input.component.scss'
})


export class CustomSearchFilterInputComponent {
  @Input() txtSerach:string = '';
  @Input() txtPlaceHolder:string = '';
  @Input() ControllerName:string = '';
  @Output() onSearchFilterInput: EventEmitter<any> = new EventEmitter();
  @ViewChild('confirmDialog') confirmDialog!:CustomConfirmDialogComponent;
  constructor(private checkUserPermissionServ:CheckUserPermissionService)
  {
    
  }
    onInput()
    {
      this.checkUserPermissionServ.check(this.ControllerName, 4).subscribe((res) => {
        if (!res)
        {
          this.confirmDialog.showDialog('lbl_noPermissionForThisEvent','lbl_warning','','lbl_Ok' , false);
        }
        else{
          this.onSearchFilterInput.emit();
        }
      }); 
    }
}
