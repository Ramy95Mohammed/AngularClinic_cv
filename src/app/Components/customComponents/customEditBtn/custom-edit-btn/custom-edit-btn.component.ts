import { Component, EventEmitter, Input, Output, input } from '@angular/core';
import { Button, ButtonModule } from 'primeng/button';
import { CheckUserPermissionService } from '../../../../services/users/permissions/check-user-permission.service';

@Component({
  selector: 'app-custom-edit-btn',
  standalone: true,
  imports: [ButtonModule],
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
  onEdit()
  {
    // if(this.checkUserPermissionServ.check(this.ControllerName , 1)){
    //   alert('No Permission');
    //   return;
    //  }
    this.onBtnEditClick.emit();
  }
}
