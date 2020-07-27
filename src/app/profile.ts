export interface Attributes {
        Date: number;
        ConfirmedCovidCases: number;
        TotalConfirmedCovidCases: number;
        ConfirmedCovidDeaths: number;
        TotalCovidDeaths: number;
        ConfirmedCovidRecovered: number;
        TotalCovidRecovered: number;
        StatisticsProfileDate: number;
        CovidCasesConfirmed: number;
        HospitalisedCovidCases: number;
        RequiringICUCovidCases: number;
        Male: number;
        Female: number;
        Unknown: number;
        Aged1: number;
        Aged1to4: number;
        Aged5to14: number;
        Aged15to24: number;
        Aged25to34: number;
        Aged35to44: number;
        Aged45to54: number;
        Aged55to64: number;
        Aged65up: number;
        CommunityTransmission: number;
        CloseContact: number;
        TravelAbroad: number;
        UnderInvestigation: number;
        FID: number;
    }

    export interface Geometry {
        x: number;
        y: number;
    }

    export class Profile {
        attributes: Attributes;
        geometry: Geometry;
    }


