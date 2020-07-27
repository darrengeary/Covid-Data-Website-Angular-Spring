import { Component } from '@angular/core';
import { RootObject } from '../../root-object';
import { MatTableDataSource } from '@angular/material/table';
import { Profile } from '../../profile';
import * as Chart from 'chart.js';
import { CountryLiveService } from '../../country-live.service';
import { LEFT_ARROW } from '@angular/cdk/keycodes';
import { CountryLive } from '../../country-live';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent {
  countyData: RootObject;
  profile: Profile;
  displayedColumns: string[] = ['county', 'cases', 'population', 'risk'];
  dataSource:any;
  totalValue: number = 0;
  ageChart: any;
  transChart: Chart;
  genderChart: Chart;
  results: CountryLive[] = [];
  ireland: CountryLive;

	constructor(private countryLiveService: CountryLiveService){
    
	}

	ngOnInit() {
    this.countryLiveService.findAll()
    .subscribe(res => {
      res.forEach(element => {
      this.results.push(new CountryLive(element));
      },);
      this.ireland = new CountryLive(this.results[1]);
    });
    this.countryLiveService.findCounties()
    .subscribe(res => { 
      this.countyData = res;
      this.dataSource = new MatTableDataSource(this.countyData.features);
      this.countyData.features.forEach(element => { this.totalValue = element.attributes.CovidCases + this.totalValue;});
    });
  this.countryLiveService.findProfile()
	.subscribe(res => {   
    this.profile = res;
    var chartData = {
			labels: ['< 1 years', '1-4 years', '5-14 years', '15-24 years', '25-34 years', '35-44 years', '45-54 years', '55-64 years', '> 65 years'],
			datasets: [{
        type: 'line',
				borderColor: "#000000",
				borderWidth: 2,
				fill: false,
				data: [
					this.profile.attributes.Aged1,
          this.profile.attributes.Aged1to4,
          this.profile.attributes.Aged5to14,
          this.profile.attributes.Aged15to24,
          this.profile.attributes.Aged25to34,
          this.profile.attributes.Aged35to44,
          this.profile.attributes.Aged45to54,
          this.profile.attributes.Aged55to64,
          this.profile.attributes.Aged65up
				]
			}, {
        type: 'bar',
        label: "Cases",
				backgroundColor: "lightblue",
				data: [
					this.profile.attributes.Aged1,
          this.profile.attributes.Aged1to4,
          this.profile.attributes.Aged5to14,
          this.profile.attributes.Aged15to24,
          this.profile.attributes.Aged25to34,
          this.profile.attributes.Aged35to44,
          this.profile.attributes.Aged45to54,
          this.profile.attributes.Aged55to64,
          this.profile.attributes.Aged65up
				],
				borderColor: 'white',
				borderWidth: 2
			}]

		};
			this.ageChart = new Chart("ageChart", {
				type: 'bar',
				data: chartData,
				options: {
          responsive: true,
          legend: {
            display: false,
            },
					title: {
						display: true,
						text: 'Age Distribution of Cases'
					},
					tooltips: {
						mode: 'index',
            intersect: true,
            callbacks: {
              label: function(tooltipItem, data) {
                return data.datasets[1].label+":		"+tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }, },
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
          maintainAspectRatio: true
				}
      });
      this.genderChart = new Chart("genderChart", {
        type: 'doughnut',
        data: {
        labels: [ 'Male', 'Female', 'Unkown'],
        datasets: [{
          data: [this.profile.attributes.Male, this.profile.attributes.Female, this.profile.attributes.Unknown],
          backgroundColor: [
            "#1e88e5",
            "#d964a4",
            "grey"
          ],
          fill:false,
          borderWidth: 1
        }]
        },
        options: {
          tooltips: {
						mode: 'index',
            intersect: true,
          },
          hover: {
            mode: 'nearest',
            intersect: true
					},
        maintainAspectRatio: true,
          responsive: true,
          legend: {
            display: true,
            position: "left",
            labels:{
              boxWidth: 20
            },
          },
          title: {
            display: true,
          },
          animation: {
            animateScale: true,
            animateRotate: true
          }
        }
      });
      this.transChart = new Chart("transChart", {
        type: 'doughnut',
        data: {
        labels: [ 'Community', 'Close Contact', 'Travelling'],
        datasets: [{
          data: [this.profile.attributes.CommunityTransmission, this.profile.attributes.CloseContact, this.profile.attributes.TravelAbroad,],
          backgroundColor: [
            "#7dad0a",
            "lightblue",
            "grey"
          ],
          fill:false,
          borderWidth: 1
        }]
        },
        options: {
          tooltips: {
						mode: 'index',
            intersect: true,
          },
          hover: {
            mode: 'nearest',
            intersect: true
					},
        maintainAspectRatio: true,
          responsive: true,
          legend: {
            display: true,
            position: "left",
            labels:{
              boxWidth: 20
            },
          },
          title: {
            display: true,
          },
          animation: {
            animateScale: true,
            animateRotate: true
          }
        }
      });
      this.getDate();
});
};
percentage(partialValue: number) {
  let percentage:number = 0;
  percentage = (100 * partialValue) / this.totalValue;
  return (Math.round(percentage * 100) / 100).toFixed(2);
} 
risk(partialValue: number, fullValue:number) {
  let percentage:number = 0;
  percentage = (100 * partialValue) / fullValue;
  return (Math.round(percentage * 100) / 100).toFixed(2);
} 
getDate() {
  let newDate = new Date(this.profile.attributes.StatisticsProfileDate);
  return newDate.toLocaleString();
} 
formatNumber(num:number) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
}