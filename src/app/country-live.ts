
export class CountryLive {
    country: String;
    totalCases:number;
    newCases:number;
    totalDeaths:number;
    newDeaths:number;
    totalRecoveries:number;
    activeCases:number;
    seriousCritical:number;
    
    constructor(
       countryLive:Object
        ){
            Object.keys(countryLive).forEach((prop) => { this[prop] = countryLive[prop]; });
    }
}



    
