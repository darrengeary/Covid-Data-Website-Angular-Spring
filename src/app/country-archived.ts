export class CountryArchived {
        country:String;
        province:String;
        lati:number;
        longi:number;
        confirmed:number[];
        recovered:number[];
        deaths:number[];

        constructor(
            countryArchived:Object
             ){
                 Object.keys(countryArchived).forEach((prop) => { this[prop] = countryArchived[prop]; });
         }
}
