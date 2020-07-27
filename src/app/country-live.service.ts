import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { map, filter, scan } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { CountryLive } from './country-live';
import { NumberValueAccessor } from '@angular/forms';
import { CountryArchived } from './country-archived';
import { Profile } from './profile';
import { RootObject } from './root-object';

@Injectable()
export class CountryLiveService {

  countryLiveUrl: string;
  cL:CountryLive;
  liveArray:Observable<CountryLive[]> 
  archiveUrl: string;
  countyStatsUrl: string;
  profileUrl: string;

  constructor(private _http:HttpClient) {
    this.countryLiveUrl = 'http://localhost:9000/countriesLive';
    this.archiveUrl = 'http://localhost:9000/arcCountries';
    this.profileUrl = 'http://localhost:9000/profileStats';
    this.countyStatsUrl = 'http://localhost:9000/countyStats';
   }
  
   findCounties():Observable<RootObject>{
    return this._http.get<RootObject>(this.countyStatsUrl);
   }
  findProfile():Observable<Profile>{
    return this._http.get<Profile>(this.profileUrl);
   }
  findAll():Observable<CountryLive[]>{
    return this._http.get<CountryLive[]>(this.countryLiveUrl);
   
  }
  getArc():Observable<CountryArchived[]>{
    return this._http.get<CountryArchived[]>(this.archiveUrl);
  }

}