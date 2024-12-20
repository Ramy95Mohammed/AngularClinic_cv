import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CheckUserPermissionService } from '../../../../services/users/permissions/check-user-permission.service';

@Component({
  selector: 'app-custom-print-btn',
  standalone: true,
  imports: [ButtonModule],
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
  onPrint()
  {
    // if(this.checkUserPermissionServ.check(this.ControllerName , 3)){
    //   alert('No Permission');
    //   return;
    //  }
    this.onBtnPrintClick.emit();
  }
}
