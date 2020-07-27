import { Component, AfterViewInit, OnInit, ElementRef } from '@angular/core';
import { AppComponent } from '../app.component';
import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from 'ng-chartist';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import { CountryLive } from './../country-live';
import {CountryLiveService} from "./../country-live.service";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs';
import * as Chart from 'chart.js';
import {MatTableDataSource} from '@angular/material/table';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { CountryArchived } from '../country-archived';
import { TagContentType } from '@angular/compiler';

declare var require: any;

const data: any = require('./data.json');

export interface Chart1 {
	type: ChartType;
	data: Chartist.IChartistData;
	options?: any;
	responsiveOptions?: any;
	events?: ChartEvent;
}

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	results:Array<CountryLive> = [];
	worldLive:CountryLive;
	ladChart: any;
	selectedCountry: CountryLive;
	selectedCountry2: CountryArchived;
	lineDataStore: CountryArchived;
	data: number[];
	timeSeries: Array<CountryArchived> = [];
	archivedChart: Chart;

	time: Date[] = [];
	startDate: Date = new Date();
	newDate:Date = new Date("01/21/2020");

	arcData:Object[] = [];
	scope: any;
	htmlRef: any;
	yesterCases: number = 0;
	yesterDeaths: number = 0;

	constructor(private countriesLiveService: CountryLiveService){
	}

	ngOnInit() {
	this.countriesLiveService.findAll()
	.subscribe(res => {
	  res.forEach(element => {
		this.results.push(new CountryLive(element));
	  },);
	  this.worldLive = new CountryLive(this.results[0]);
	  this.results.shift();
	  this.selectedCountry = new CountryLive(this.results[0]);
  
	  this.ladChart = new Chart("ladChart", {
		  type: 'pie',
		  data: {
			labels: ['Total Recoveries', 'Active Cases', 'Total Deaths'],
			datasets: [{
			  data: [this.selectedCountry.totalRecoveries, this.selectedCountry.activeCases, this.selectedCountry.totalDeaths],
			  backgroundColor: [
				  "#afff75",
				  "#ff7575",
				  "#575757",
			  ],
			  fill:false,
			  borderWidth: 1
			}]
		  },
		  options: {
			maintainAspectRatio: true,
			  responsive: true,
			  legend: null,
			  title: {
				  display: true,
			  },
			  animation: {
				  animateScale: true,
				  animateRotate: true
			  }
		  }
	  });
	});
	 
  	this.displayData();
	}

	displayData(){
	this.countriesLiveService.getArc()
	.subscribe(res => {
	  res.forEach(element => {
		this.timeSeries.push(new CountryArchived(element));
	  },);
	 this.timeSeries.forEach(element => { 
		if(element.country === "Ireland"){
			this.newDate = new Date("01/21/2020");
			this.selectedCountry2 = new CountryArchived(element);
			this.addDaysFrom(this.newDate);
			this.yesterCases = this.calcYesterCases();
			this.yesterDeaths = this.calcYesterDeaths();
		}
	});

	console.log(this.selectedCountry2);
	this.archivedChart = new Chart('archivedChart', {
		type: 'line',                         // Define type of chart
		data: {
		  labels: this.time,              //Fill data in labels      
		  datasets: [
			{
			  data: this.selectedCountry2?.confirmed,
			  label: "Confirmed",   // set data that fetch from database
			  borderColor: '#ff4d4a',
			  fill: true,
			  borderWidth: [2],
		  backgroundColor: [       //set background color of graph
				"#3cb371",  
				"#0000FF",  
				"#9966FF",  
				"#4C4CFF",  
				"#00FFFF",  
				"#f990a7",  
				"#aad2ed",  
				"#FF00FF",  
				"Blue",  
				"Red",  
				"Blue"  
			  ],
			},
			{
			  data: this.selectedCountry2?.recovered,
			  label: "Recoveries",
			  borderColor: '#4cb500',
			  fill: false,
			  borderWidth: [2],
			},
			{
			  data: this.selectedCountry2?.deaths,
			  label: "Deaths",
			  borderColor: '#000000',
			  fill: false,
			  borderWidth: [2],
			},
		  ]},

		options: {
			tooltips: {
				mode: 'index',
				intersect: false,
				callbacks: {
					label: function(tooltipItem, data) {
						return data.datasets[tooltipItem.datasetIndex].label+":		"+tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }, },
			},
			hover: {
				mode: 'nearest',
				intersect: true
			},
			responsive: true,
		  legend: {
			display: false,
		  },
		  
		  elements: {
			point:
			{
			  radius: 0,
			},
		  },

		  scales: {    
			xAxes: [{
				type: 'time',
				ticks:{
					source: 'auto',
				},
				distribution: 'linear',
				time: {
					unit: 'day'
				}
			}],
			yAxes: [{
				type: 'logarithmic',
				ticks: {
					min: 0,
					max: 1000000,
					callback: function (value, index, values) {
						if (value === 1000000) return "1M";
						if (value === 100000) return "100K";
						if (value === 10000) return "10K";
						if (value === 1000) return "1K";
						if (value === 100) return "100";
						if (value === 10) return "10";
						if (value === 0) return "0";
						return null;
					}
			   }
			},
			]
		  }
		}

	  });
	;}
	);

}
	displayedColumns: string[] = ['country', 'totalCases', 'newCases', 'totalRecoveries', 'seriousCritical', 'totalDeaths', 'newDeaths'];
	dataSource = new MatTableDataSource(this.results);
  
	applyFilter(event: Event) {
	  const filterValue = (event.target as HTMLInputElement).value;
	  this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	positive(val:String){
		if (val === "0"){
			return val
		}else{
			return "+"+val;
		}

	}

	selectCountry(element:String){

		this.selectedCountry =  this.results.filter(x => x.country == element)[0];
		
		this.timeSeries.forEach(element => { 
			if(element.country === this.selectedCountry.country){
				this.selectedCountry2 = new CountryArchived(element);
				this.yesterCases = this.calcYesterCases();
				this.yesterDeaths = this.calcYesterDeaths();
				
			}
		});

		this.ladChart.data.datasets[0].data[1] = this.selectedCountry?.activeCases;
		this.ladChart.data.datasets[0].data[0] = this.selectedCountry?.totalRecoveries;
		this.ladChart.data.datasets[0].data[2] = this.selectedCountry?.totalDeaths;

		this.archivedChart.data.datasets[0].data = this.selectedCountry2?.confirmed
		this.archivedChart.data.datasets[1].data = this.selectedCountry2?.recovered
		this.archivedChart.data.datasets[2].data = this.selectedCountry2?.deaths;

		this.archivedChart.update();
		this.ladChart.update();

	}
	formatNumber(num:number) {
		return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
	}

	addDaysFrom(date:Date) {
		this.time = [];
		for (var x in this.selectedCountry2.confirmed) {
			this.newDate.setDate(this.newDate.getDate() + 1);
			this.time.push(new Date(this.newDate));
	  }
	  console.log( this.time);
	}

	toggleLog1:boolean = true;
	toggleLog(){
		let log = [{
			type: 'logarithmic',
			ticks: {
				min: 0,
				max: 1000000,
				callback: function (value, index, values) {
					if (value === 1000000) return "1M";
					if (value === 100000) return "100K";
					if (value === 10000) return "10K";
					if (value === 1000) return "1K";
					if (value === 100) return "100";
					if (value === 10) return "10";
					if (value === 0) return "0";
					return null;
				}
		   }
		},
		]
		let linear = [{
			scaleLabel: {
				display: true,
			}
		}]

		this.toggleLog1 = !this.toggleLog1;
		if(this.toggleLog1){
			this.archivedChart.options.scales.yAxes = log;
		}else if(!this.toggleLog1){
			this.archivedChart.options.scales.yAxes = linear;
		}
		this.archivedChart.update();
	}

	toggle0:boolean = false;
	toggle1:boolean = false;
	toggle2:boolean = false;
	toggleData0(){
		this.toggle0 = !this.toggle0;
		if(this.toggle0){this.archivedChart.data.datasets[0].hidden = true;}
		else if(!this.toggle0){this.archivedChart.data.datasets[0].hidden = false;}
		this.archivedChart.update();
	}
	toggleData1(){
		this.toggle1 = !this.toggle1;
		if(this.toggle1){this.archivedChart.data.datasets[1].hidden = true;}
		else if(!this.toggle1){this.archivedChart.data.datasets[1].hidden = false;}
		this.archivedChart.update();
	}
	toggleData2(){
		this.toggle2 = !this.toggle2;
		if(this.toggle2){this.archivedChart.data.datasets[2].hidden = true;}
		else if(!this.toggle2){this.archivedChart.data.datasets[2].hidden = false;}
		this.archivedChart.update();
	}

	setXAxis(){
		let y:any;
		let x:number = 0;
		this.selectedCountry2.confirmed.forEach(element => {
			if(element > 0){
				y = []

			}

		})
	}
	calcYesterDeaths(){
		console.log(this.selectedCountry2.confirmed)
		return this.yesterDeaths = (this.selectedCountry2.deaths[this.selectedCountry2.confirmed.length -1])-(this.selectedCountry2.deaths[this.selectedCountry2.confirmed.length -2]);
	}
	
	calcYesterCases(){
		return (this.selectedCountry2.confirmed[this.selectedCountry2.confirmed.length -1])-(this.selectedCountry2.confirmed[this.selectedCountry2.confirmed.length -2]);
	}
}