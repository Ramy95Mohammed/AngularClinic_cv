import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CheckUserPermissionService } from '../../../../services/users/permissions/check-user-permission.service';

@Component({
  selector: 'app-custom-delete-btn',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './custom-delete-btn.component.html',
  styleUrl: './custom-delete-btn.component.scss'
})
export class CustomDeleteBtnComponent {
  @Output() onBtnDeleteClick: EventEmitter<any> = new EventEmitter();
  @Input() ControllerName:string = '';
  constructor(private checkUserPermissionServ:CheckUserPermissionService)
  {
    
  }
  onDelete()
  { 
  //     if(this.checkUserPermissionServ.check(this.ControllerName , 2)){
  //   alert('No Permission');
  //   return;
  //  }
    this.onBtnDeleteClick.emit();
  }
}
