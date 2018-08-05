import * as AWS from 'aws-sdk';
import { Bar } from './bar';

const LIMITED_LIST = "bars.json";
const FULL_LIST = "bars-full.json";

const BUCKET = process.env.BAR_DATA_BUCKET as string;

if(!BUCKET) throw new Error("bucketeer.ts || Missing BAR_DATA_BUCKET environment variable - make sure it's set!");

interface Storage {

    storeFullBarDetails: (bars: Array<Bar>) => Promise<Boolean>;
    storeLimitedBarDetails: (bars: Array<Bar>) => Promise<Boolean>;

    retrieveFullBarDetails: () => Promise<Array<Bar>>;
    retrieveLimitedBarDetails: () => Promise<Array<Bar>>;
}

class BucketStorage implements Storage  {

    S3 = new AWS.S3();
    
    storeFullBarDetails: (bars: Bar[]) => Promise<boolean> = (bars) => {
        return this.storeBarsListToBucket(bars, FULL_LIST);
    }
    
    storeLimitedBarDetails: (bars: Bar[]) => Promise<boolean> = (bars) => {
        return this.storeBarsListToBucket(bars, LIMITED_LIST);
    }

    retrieveFullBarDetails: () => Promise<Bar[]> = () => {
        return this.retrieveBarsListFromBucket(FULL_LIST);
    };

    retrieveLimitedBarDetails: () => Promise<Bar[]> = () => {
        return this.retrieveBarsListFromBucket(LIMITED_LIST);
    };

    private storeBarsListToBucket = (bars: Bar[], filename: string) => {
        return new Promise<boolean> ( (resolve, reject) => {

            this.S3.putObject({
                Bucket: BUCKET,
                Key: filename
            }, (error, data) => {

                if(error) reject(error);
                else return true;
            });
        });
    }

    private retrieveBarsListFromBucket = (filename: string) => {
        return new Promise<Bar[]> ( (resolve, reject) => {

            this.S3.getObject({
                Bucket: BUCKET,
                Key: filename
            }, 
            (error, data) => {
                if(error) reject(error);

                if(data && data.Body){
                    return (JSON.parse(data.Body as string) as Bar[]);
                }
                else reject("Missing data");
            });
        });
    }
}

let bucketStorage: BucketStorage | null = null;

const getStorage = () => {
    if(!bucketStorage) bucketStorage = new BucketStorage();
    return bucketStorage;
}

const storeFullBarDetails = (bars: Array<Bar>) => getStorage().storeFullBarDetails(bars); 
const storeBarsList = (bars: Array<Bar>) => getStorage().storeLimitedBarDetails(bars);
const fetchBarsList = () => getStorage().retrieveLimitedBarDetails();
const fetchFullBarsList = () => getStorage().retrieveFullBarDetails();

export { Storage, storeFullBarDetails, storeBarsList, fetchBarsList, fetchFullBarsList };