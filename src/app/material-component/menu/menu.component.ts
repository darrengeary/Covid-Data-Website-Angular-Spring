import { CountryLive } from '../../country-live';
import { Observable } from 'rxjs';
import { CountryLiveService } from '../../country-live.service';
import { Component, AfterViewInit, OnInit } from '@angular/core';


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit{

	results:Array<CountryLive> = [];
  
	constructor(private countriesLiveService: CountryLiveService){}
   
	ngOnInit() {
	  this.countriesLiveService.findAll()
	  .subscribe(res => {
		res.forEach(element => {
		  this.results.push(new CountryLive(element));
		},);
		console.log(this.results);
  
	  })
  }
}
