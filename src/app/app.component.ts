import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {CountryLiveService} from "./country-live.service";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import {enableProdMode} from '@angular/core';
import { environment } from '../environments/environment';



import { CountryLive } from './country-live';
import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from 'ng-chartist';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Observable } from 'rxjs';
import { data } from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  liveArray:Observable<CountryLive[]>
  results:Array<CountryLive> = [];
  
  constructor(private countriesLiveService: CountryLiveService){}
 
  ngOnInit() {
    this.countriesLiveService.findAll()
    .subscribe(res => {
      res.forEach(element => {
        this.results.push(new CountryLive(element));
      },);
      console.log(this.results);

    },)

  }}  