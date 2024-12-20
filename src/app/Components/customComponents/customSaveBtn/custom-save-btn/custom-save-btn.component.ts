import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CheckUserPermissionService } from '../../../../services/users/permissions/check-user-permission.service';

@Component({
  selector: 'app-custom-save-btn',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './custom-save-btn.component.html',
  styleUrl: './custom-save-btn.component.scss'
})
export class CustomSaveBtnComponent {


  constructor(private checkUserPermissionServ:CheckUserPermissionService)
  {
    
  }

  @Output() onBtnSaveClick: EventEmitter<any> = new EventEmitter();
  @Input() icon:string = 'pi pi-save';
  @Input() label:string = '';
  @Input() severity:any = 'success';
  @Input() rounded:boolean = true;
  @Input() text:boolean = false;
  @Input() outlined:boolean = true;
  @Input() ControllerName:string = '';
  onSave()
  {
    //  if(this.checkUserPermissionServ.check(this.ControllerName , 0)){
    //   alert('No Permission');
    //   return;
    //  }
    this.onBtnSaveClick.emit();
  }
}
