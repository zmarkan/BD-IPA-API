import { Handler, Context, Callback, APIGatewayEvent } from 'aws-lambda';
import { fetchBeersForBarByBarId } from './src/on_tap_scraper';
import { fetchDetailsForBar } from './src/bar_details_scraper';
import { OnTap } from "./src/ontap";
import { Bar } from './src/bar'
import * as fs from 'fs';
import * as aws from 'aws-sdk';

import { fetchBarsList, fetchFullBarsList, storeBarsList, storeFullBarDetails} from "./src/bucketeer";
import { eventNames } from 'cluster';
import { scrapeBars } from './src/bars_scraper';
import { scrapeFullBarDetails } from './src/full_bar_details_scraper';

const FULL_BARS_RESPONSE = "static/bars-full.json";
const REGULAR_BARS_RESPONSE = "static/bars.json";

interface Response {
  statusCode: number;
  body: string
}

//Le functions
const getAllBars: Handler = (event: APIGatewayEvent, context: Context, callback: Callback) => {
  let returnFullDetails = false;

  if (event.queryStringParameters && event.queryStringParameters.full_details) {
    returnFullDetails = event.queryStringParameters.full_details === "true";
  }
  
  fs.readFile(returnFullDetails ? FULL_BARS_RESPONSE : REGULAR_BARS_RESPONSE, (error, allBarsResponse) => {

    const response: Response = {
      statusCode: 200,
      body: allBarsResponse.toString()
    };
  
    callback(undefined, response);
  });
};

//TODO: 404 LOL
const getBeersInBar: Handler = (event, context, callback) => {

  const barId = event.pathParameters.bar;

  fetchBeersForBarByBarId(barId).then( (taps) => {
    callback(undefined, { statusCode: 200, body: JSON.stringify(taps)});
  }).catch( (reason) => {
    callback(reason);
  })
}

const getBarDetails: Handler = (event, context, callback) => {

  const barId: string = event.pathParameters.bar;

  fs.readFile(REGULAR_BARS_RESPONSE, (error, allBarsResponse) => {
    
    if(error) callback(error, undefined);

    let allBars = JSON.parse(allBarsResponse.toString()) as Array<Bar>;
    let bar =  allBars.find( bar => bar.id === barId );
    
    if(bar){

      fetchDetailsForBar(bar).then( (barWithDetails) => {
        callback(undefined, { statusCode: 200, body: JSON.stringify(barWithDetails)});
      }).catch( (reason) => {
        callback(reason);
      });
    }
    else {
      callback(null, {
        status: 404,
        body: "No bar found with id ${barID}."
      });
    }
  });
}

const refreshBarsList: Handler = (event, context, callback) => {

  scrapeBars()
    .then( bars => storeBarsList(bars))
    .then( success => {
      if(success) callback(null, { status: 200, result: "Success" });    
      else callback(null, { status: 500, result: "Internal server error"});
  });
};

const refreshFullBarsList: Handler = (event, context, callback) => {
  
  scrapeBars()
    .then( bars => scrapeFullBarDetails(bars))
    .then( fullBars => storeFullBarDetails(fullBars))
    .then( success => {

      if(success) callback(null, { status: 200, result: "Success" });    
      else callback(null, { status: 500, result: "Internal server error"});

    });
};



export { getAllBars, getBarDetails, getBeersInBar, refreshBarsList, refreshFullBarsList }