import { CountryLive } from '../../../country-live';
import {CountryLiveService} from "../../../country-live.service";

import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  ViewChild,
  HostListener,
  Directive,
  AfterViewInit
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuItems } from '../../../shared/menu-items/menu-items';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss']
})
export class AppSidebarComponent implements OnDestroy {
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;
  results:Array<CountryLive> = [];
  worldLive: CountryLive;

  constructor(
    private countriesLiveService: CountryLiveService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.countriesLiveService.findAll()
      .subscribe(res => {
      res.forEach(element => {
        this.results.push(new CountryLive(element));
      },);
      this.worldLive = new CountryLive(this.results[0]);
      this.results.shift();
    })
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  formatNumber(num:number) {
		return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
	  }
}
