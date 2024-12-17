import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';
import { LocalizeService } from '../../../../services/localize/localize.service';
import { Toast, ToastModule, ToastPositionType } from 'primeng/toast';

@Component({
  selector: 'app-custom-confirm-dialog',
  standalone: true,
  imports: [ConfirmDialogModule , ToastModule], 
  providers:[MessageService  , ConfirmationService], 
  templateUrl: './custom-confirm-dialog.component.html',
  styleUrl: './custom-confirm-dialog.component.scss'
})
export class CustomConfirmDialogComponent {
      toastPosition:ToastPositionType  = 'bottom-right';
      position:any;
          constructor(private confirmationService:ConfirmationService, private messageService: MessageService,private _localizeServe:LocalizeService ) {
           
    }
    showDialog(message:string , headerMsg:string , acceptLabel:string , rejectLabel:string)
    {
      this.getLayoutDirection();
      this.confirmationService.confirm({
        message: this._localizeServe.getLabelValue(message) ,
        header: this._localizeServe.getLabelValue(headerMsg),
         acceptLabel:this._localizeServe.getLabelValue(acceptLabel),
         rejectLabel:this._localizeServe.getLabelValue(rejectLabel),
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            //check user permissions
           console.log('delete from child');
           // this.messageService.add({ severity: 'success', summary: this._localizeServe.getLabelValue('lbl_success'), detail: this._localizeServe.getLabelValue('lbl_missionCompletedSuccessfully'), life: 3000 });
            this.onConfirm.emit();
        }
    });
    }
    @Output() onConfirm: EventEmitter<any> = new EventEmitter(); 
    getLayoutDirection()
    {
      if (typeof document !== 'undefined') {
       let el =  document.getElementById('mainLayout');
       const dir = el?.getAttribute('dir');
      this.position = dir =='rtl'?'bottom-right':'bottom-left';
    }
}
}
