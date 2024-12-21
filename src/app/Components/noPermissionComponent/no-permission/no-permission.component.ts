import { Component } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { LocalizeService } from '../../../services/localize/localize.service';

@Component({
  selector: 'app-no-permission',
  standalone: true,
  imports: [TagModule],
  templateUrl: './no-permission.component.html',
  styleUrl: './no-permission.component.scss'
})
export class NoPermissionComponent {
  _localizeServ:LocalizeService;
  constructor(localizeServ:LocalizeService)
  {
    this._localizeServ = localizeServ;
  }
}
