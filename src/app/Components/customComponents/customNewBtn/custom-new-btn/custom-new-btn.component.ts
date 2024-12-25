import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { LocalizeService } from '../../../../services/localize/localize.service';
import { CheckUserPermissionService } from '../../../../services/users/permissions/check-user-permission.service';
import { TooltipModule } from 'primeng/tooltip';
@Component({
  selector: 'app-custom-new-btn',
  standalone: true,
  imports: [ButtonModule,TooltipModule],
  templateUrl: './custom-new-btn.component.html',
  styleUrl: './custom-new-btn.component.scss'
})
export class CustomNewBtnComponent {
  _localzieServ:LocalizeService;
  constructor(localizeServ:LocalizeService)
  {
    this._localzieServ = localizeServ;
  }
  @Output() onBtnNewClick: EventEmitter<any> = new EventEmitter();
  @Input() icon:string = 'pi pi-pencil';
  @Input() label:string = '';
  @Input() severity:any = 'success';
  @Input() rounded:boolean = true;
  @Input() text:boolean = false;
  @Input() outlined:boolean = true;
  @Input() ControllerName:string = '';


      emitBtnNewClickEvent()
      {
        this.onBtnNewClick.emit();
      }
}
