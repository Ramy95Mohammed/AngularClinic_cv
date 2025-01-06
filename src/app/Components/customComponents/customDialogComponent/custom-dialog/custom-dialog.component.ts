import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef, ViewChild, input, OnInit } from '@angular/core';
import { ImportsModule } from '../../../../app/imports';
import { LocalizeService } from '../../../../services/localize/localize.service';
import { CustomEditBtnComponent } from "../../customEditBtn/custom-edit-btn/custom-edit-btn.component";
import { CustomSaveBtnComponent } from "../../customSaveBtn/custom-save-btn/custom-save-btn.component";
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-custom-dialog',
  standalone: true,
  imports: [ImportsModule, CustomEditBtnComponent, CustomSaveBtnComponent],
  templateUrl: './custom-dialog.component.html',
  styleUrl: './custom-dialog.component.scss'
})
export class CustomDialogComponent implements OnInit{
  _localizeServe:LocalizeService;
  @Input() visible: boolean = false; 
  @Input() header: string = ''; 
  @Input() width: string = '450px';
  @Input() height:string ='450px';
  @Input() modal: boolean = true; 
  @Input() styleClass: string = 'p-fluid max-height-dialog'; 
  @Input() contentStyle = {}; 
  @Input() saveOrEdit: boolean = true; 
  @Input() ControllerName: string = '';
  @Input() maximizable: boolean = true; 
  @Input() resizable: boolean = true; 
  @Output() onBtnSaveClick: EventEmitter<any> = new EventEmitter();
  @Output() onBtnEditClick: EventEmitter<any> = new EventEmitter();

  @Output() onClose: EventEmitter<any> = new EventEmitter(); 

  @ViewChild('pDialog') pDialog!:Dialog;
  @ContentChild('dialogContent') dialogContent: TemplateRef<any> | null = null; 
  @ContentChild('dialogFooter') dialogFooter: TemplateRef<any> | null = null; 
  constructor(localizeServe:LocalizeService)
  {
   this._localizeServe = localizeServe;
  
  }
  ngOnInit(): void {
    
  }

  hideDialog(): void {
    
    this.visible = false;    
    this.onClose.emit(); 
  }


  handleSave(): void {
   this.onBtnSaveClick.emit();
  }

  handleEdit(): void {
    this.onBtnEditClick.emit();
  }
  resetDialog(): void {
    
    this.hideDialog();
   
  }
}
