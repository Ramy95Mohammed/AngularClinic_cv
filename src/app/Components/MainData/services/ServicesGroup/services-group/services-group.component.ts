import { Component, OnInit } from '@angular/core';
import { ImportsModule } from '../../../../../app/imports';
import { LocalizeService } from '../../../../../services/localize/localize.service';
import { CustomDeleteBtnComponent } from "../../../../customComponents/customDeleteBtn/custom-delete-btn/custom-delete-btn.component";
import { HelperService } from '../../../../../services/helper.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-services-group',
  standalone: true,
  imports: [ImportsModule, CustomDeleteBtnComponent],
  templateUrl: './services-group.component.html',
  styleUrl: './services-group.component.scss'
})
export class ServicesGroupComponent implements OnInit {
  _localizeServe: LocalizeService;
  ControllerName: string = 'ServicesGroup';
  priceCurrency: string = this.helperServ.currency;
  servicesGroupDetailsData: any[] = [];
  serviceGroupForm: FormGroup;
  servicesGroupDetailsFormArr: FormArray;
  constructor(localizeServ: LocalizeService, private helperServ: HelperService) {
    this._localizeServe = localizeServ;
    this.serviceGroupForm = this.initServiceGroupForm(null);
    this.servicesGroupDetailsFormArr = this.initServicesGroupDetailsFormArr(null);
  }
  ngOnInit(): void {
    //this.servicesGroupDetailsFormArr.push();
  }

  initServiceGroupForm(service: any): FormGroup {
    return new FormGroup({
      keyId: new FormControl(service?.keyId ?? 0, Validators.required),
      name: new FormControl(service?.name ?? '', [Validators.required, Validators.pattern("^(?!\\s+$).+")]),
      totalBeforeDiscount: new FormControl(service?.totalBeforeDiscount, [Validators.required, Validators.pattern("^(?!\\s+$).+")]),
      discountRatio: new FormControl(service?.discountRatio ?? 0, [Validators.required, Validators.pattern("^(?!\\s+$).+")]),
      discountValue: new FormControl(service?.discountValue ?? 0, [Validators.required, Validators.pattern("^(?!\\s+$).+")]),
      totalAfterDiscount: new FormControl(service?.totalAfterDiscount, [Validators.required, Validators.pattern("^(?!\\s+$).+")]),
      taxRate: new FormControl(service?.taxRate, [Validators.required, Validators.pattern("^(?!\\s+$).+")]),
      net: new FormControl(service?.net, [Validators.required, Validators.pattern("^(?!\\s+$).+")]),
      notes: new FormControl(service?.notes, [Validators.required, Validators.pattern("^(?!\\s+$).+")]),
      servicesGroupDetails: new FormArray([])

    });
  }
  initServicesGroupDetailsFormArr(serviceDetail:any): FormArray {
     return new FormArray([new FormGroup({
      keyId: new FormControl(serviceDetail?.keyId ?? 0, Validators.required),
      servicesGroupId:new FormControl(serviceDetail?.servicesGroupId??0 , Validators.required),
      singleServiceId:new FormControl(serviceDetail?.singleServiceId , Validators.required),
      quantity : new FormControl(serviceDetail?.quantity , Validators.required),
      price:new FormControl(serviceDetail?.price??0, Validators.required) 
     })])
  }
  get getServicesGroupDetailsFormArrControls():any
  {
    return this.servicesGroupDetailsFormArr.controls;
  }
}
