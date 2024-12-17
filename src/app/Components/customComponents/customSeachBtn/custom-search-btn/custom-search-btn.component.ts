import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-custom-search-btn',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './custom-search-btn.component.html',
  styleUrl: './custom-search-btn.component.scss'
})
export class CustomSearchBtnComponent {
  @Output() onBtnSearchClick: EventEmitter<any> = new EventEmitter();
  @Input() icon:string = 'pi pi-search';
  @Input() label:string = '';
  @Input() severity:any = 'success';
  @Input() rounded:boolean = true;
  @Input() text:boolean = false;
  @Input() outlined:boolean = true;
  onSearch()
  {
    this.onBtnSearchClick.emit();
  }
}
