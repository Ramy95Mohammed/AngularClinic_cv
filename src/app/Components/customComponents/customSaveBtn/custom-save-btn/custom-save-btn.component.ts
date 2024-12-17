import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-custom-save-btn',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './custom-save-btn.component.html',
  styleUrl: './custom-save-btn.component.scss'
})
export class CustomSaveBtnComponent {
  @Output() onBtnSaveClick: EventEmitter<any> = new EventEmitter();
  @Input() icon:string = 'pi pi-save';
  @Input() label:string = '';
  @Input() severity:any = 'success';
  @Input() rounded:boolean = true;
  @Input() text:boolean = false;
  @Input() outlined:boolean = true;
  onSave()
  {
    this.onBtnSaveClick.emit();
  }
}
