import { Component } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { LocalizeService } from '../services/localize/localize.service';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [TagModule],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent {
  _localizeServ:LocalizeService;
  constructor(localizeServ:LocalizeService)
  {
    this._localizeServ = localizeServ;
  }
}
