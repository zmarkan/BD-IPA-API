import * as aws from 'aws-sdk';
import { Bar } from './bar';
import { resolve } from 'url';

//TODO

//Files
const LIMITED_LIST = "";
const FULL_LIST = "";

export interface Storage {

    storeFullBarDetails: (bars: Array<Bar>) => Promise<Boolean>;
    storeLimitedBarDetails: (bars: Array<Bar>) => Promise<Boolean>;

    retrieveFullBarDetails: () => Promise<Array<Bar>>;
    retrieveLimitedBarDetails: () => Promise<Array<Bar>>;
}

class BucketStorage implements Storage  {
    
    storeFullBarDetails: (bars: Bar[]) => Promise<Boolean> = (bars) => {

        return new Promise<Boolean> ( (resolve, reject) => {
        });
    }
    
    storeLimitedBarDetails: (bars: Bar[]) => Promise<Boolean> = (bars) => {

        return new Promise<Boolean> ( (resolve, reject) => {

        });
    }

    retrieveFullBarDetails: () => Promise<Bar[]> = () => {
        return this.retrieveBarsListFromBucket(FULL_LIST);
    };

    retrieveLimitedBarDetails: () => Promise<Bar[]> = () => {
        return this.retrieveBarsListFromBucket(LIMITED_LIST);
    };

    private retrieveBarsListFromBucket = (filename: string) => {
        return new Promise<Bar[]> ( (resolve, reject) => {});
    }


}





export const storeFullBarDetails = (bars: Array<Bar>) => {



}

export const storeBarsList = (bars: Array<Bar>) => {


}



export const fetchBarsList = () => {

    return new Promise<Array<Bar>> ( (resolve, reject) => {



    });

}