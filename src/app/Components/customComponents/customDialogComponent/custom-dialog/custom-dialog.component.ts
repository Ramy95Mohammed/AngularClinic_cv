import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { ImportsModule } from '../../../../app/imports';
import { LocalizeService } from '../../../../services/localize/localize.service';
import { CustomEditBtnComponent } from "../../customEditBtn/custom-edit-btn/custom-edit-btn.component";
import { CustomSaveBtnComponent } from "../../customSaveBtn/custom-save-btn/custom-save-btn.component";

@Component({
  selector: 'app-custom-dialog',
  standalone: true,
  imports: [ImportsModule, CustomEditBtnComponent, CustomSaveBtnComponent],
  templateUrl: './custom-dialog.component.html',
  styleUrl: './custom-dialog.component.scss'
})
export class CustomDialogComponent {
  _localizeServe:LocalizeService;
  constructor(localizeServe:LocalizeService)
  {
   this._localizeServe = localizeServe;
  }
  @Input() visible: boolean = false; // Control the visibility of the dialog
  @Input() header: string = ''; // Title of the dialog
  @Input() width: string = '450px'; // Width of the dialog
  @Input() modal: boolean = true; // Whether the dialog is modal or not
  @Input() styleClass: string = 'p-fluid max-height-dialog'; // Custom style classes
  @Input() saveOrEdit: boolean = true; //true for save
  

  @Input() onSave: () => void = () => {
   
  };    // Default empty function

  @Input() onEdit: () => void = () => {
   
  }; 

  @Output() onClose: EventEmitter<any> = new EventEmitter(); // Event emitter when closing the dialog
  @ContentChild('dialogContent') dialogContent: TemplateRef<any> | null = null; // To inject content in dialog
  @ContentChild('dialogFooter') dialogFooter: TemplateRef<any> | null = null; // To inject content in dialog
  hideDialog(): void {
    this.visible = false;
    this.onClose.emit(); // Emit event on close
  }


  handleSave(): void {
    console.log('from child Save');
    if (this.onSave) {


      // Execute parent onSave logic first
      this.onSave();  
    }
  }

  handleEdit(): void {
    console.log('from child Edit');
    if (this.onEdit) {


      this.onEdit();  
    }
  }
  resetDialog(): void {
    // Optional: Reset dialog internal state, like position if needed
    this.hideDialog();
    // Reset position, if applicable, by manually setting positions or clearing styles
  }
}
