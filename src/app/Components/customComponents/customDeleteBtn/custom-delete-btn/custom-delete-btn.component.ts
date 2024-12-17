import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-custom-delete-btn',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './custom-delete-btn.component.html',
  styleUrl: './custom-delete-btn.component.scss'
})
export class CustomDeleteBtnComponent {
  @Output() onBtnDeleteClick: EventEmitter<any> = new EventEmitter();

  onDelete()
  {
    this.onBtnDeleteClick.emit();
  }
}
