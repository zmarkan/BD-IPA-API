import { Handler, Context, Callback } from 'aws-lambda';
import { Bar, fetchBeersForBarByBarId } from './src/dog_scraper';

interface BarsResponse {
    statusCode: number;
    body: string;
}

//Replace this with the output from `script/bars_parser.ts` once in a while. TBH this could also live on S3 or something.
const allBars = JSON.parse(`[{"id":"41","title":"Aberdeen","url":"https://www.brewdog.com/bars/uk/aberdeen"},{"id":"9998","title":"Angel","url":"https://www.brewdog.com/bars/uk/angel"},{"id":"5758","title":"Birmingham","url":"https://www.brewdog.com/bars/uk/birmingham"},{"id":"7490","title":"Brighton","url":"https://www.brewdog.com/bars/uk/brighton"},{"id":"5761","title":"Bristol","url":"https://www.brewdog.com/bars/uk/bristol"},{"id":"5762","title":"Camden","url":"https://www.brewdog.com/bars/uk/camden"},{"id":"5763","title":"Cardiff","url":"https://www.brewdog.com/bars/uk/cardiff"},{"id":"7963","title":"Castlegate","url":"https://www.brewdog.com/bars/uk/castlegate"},{"id":"5764","title":"Clapham Junction","url":"https://www.brewdog.com/bars/uk/clapham-junction"},{"id":"7962","title":"Clerkenwell","url":"https://www.brewdog.com/bars/uk/clerkenwell"},{"id":"7824","title":"DogHouse Merchant City","url":"https://www.brewdog.com/bars/uk/doghouse-merchant-city"},{"id":"5766","title":"DogTap & DogWalk Brewery Tour","url":"https://www.brewdog.com/bars/uk/dogtap"},{"id":"5767","title":"Dundee","url":"https://www.brewdog.com/bars/uk/dundee"},{"id":"5768","title":"Edinburgh","url":"https://www.brewdog.com/bars/uk/edinburgh"},{"id":"5771","title":"Glasgow","url":"https://www.brewdog.com/bars/uk/glasgow"},{"id":"5773","title":"Leeds","url":"https://www.brewdog.com/bars/uk/leeds"},{"id":"6498","title":"Leicester","url":"https://www.brewdog.com/bars/uk/leicester"},{"id":"5774","title":"Liverpool","url":"https://www.brewdog.com/bars/uk/liverpool"},{"id":"9695","title":"Lothian Road Edinburgh","url":"https://www.brewdog.com/bars/uk/lothian-road"},{"id":"5775","title":"Manchester","url":"https://www.brewdog.com/bars/uk/manchester"},{"id":"5776","title":"Newcastle","url":"https://www.brewdog.com/bars/uk/newcastle"},{"id":"7294","title":"North Street Leeds","url":"https://www.brewdog.com/bars/uk/northstreetleeds"},{"id":"8345","title":"Norwich","url":"https://www.brewdog.com/bars/uk/norwich"},{"id":"5777","title":"Nottingham","url":"https://www.brewdog.com/bars/uk/nottingham"},{"id":"9883","title":"Overworks Tap Room","url":"https://www.brewdog.com/bars/uk/overworkstaproom"},{"id":"9242","title":"Oxford","url":"https://www.brewdog.com/bars/uk/oxford"},{"id":"9589","title":"Reading","url":"https://www.brewdog.com/bars/uk/reading"},{"id":"5780","title":"Sheffield","url":"https://www.brewdog.com/bars/uk/sheffield"},{"id":"5781","title":"Shepherd's Bush","url":"https://www.brewdog.com/bars/uk/shepherds-bush"},{"id":"9684","title":"Seven Dials","url":"https://www.brewdog.com/bars/uk/sevendials"},{"id":"5909","title":"Shoreditch","url":"https://www.brewdog.com/bars/uk/shoreditch"},{"id":"7844","title":"Soho","url":"https://www.brewdog.com/bars/uk/soho"},{"id":"8628","title":"Southampton","url":"https://www.brewdog.com/bars/uk/southampton"},{"id":"7923","title":"Stirling","url":"https://www.brewdog.com/bars/uk/stirling"},{"id":"9567","title":"Tower Hill","url":"https://www.brewdog.com/bars/uk/tower-hill"},{"id":"8736","title":"York","url":"https://www.brewdog.com/bars/uk/york"},{"id":"8841","title":"DogTap Columbus & DogWalk USA","url":"https://www.brewdog.com/bars/usa/dogtap-columbus"},{"id":"9568","title":"Franklinton","url":"https://www.brewdog.com/bars/usa/franklinton"},{"id":"9888","title":"Short North","url":"https://www.brewdog.com/bars/usa/short-north"},{"id":"5757","title":"Barcelona","url":"https://www.brewdog.com/bars/worldwide/barcelona"},{"id":"8685","title":"Berlin Mitte","url":"https://www.brewdog.com/bars/worldwide/berlin-mitte"},{"id":"5759","title":"Bologna","url":"https://www.brewdog.com/bars/worldwide/bologna"},{"id":"7671","title":"Brussels","url":"https://www.brewdog.com/bars/worldwide/brussels"},{"id":"5769","title":"Firenze","url":"https://www.brewdog.com/bars/worldwide/firenze"},{"id":"5770","title":"Göteborg","url":"https://www.brewdog.com/bars/worldwide/goteborg"},{"id":"7102","title":"Grünerløkka","url":"https://www.brewdog.com/bars/worldwide/grunerlokka"},{"id":"5772","title":"Helsinki","url":"https://www.brewdog.com/bars/worldwide/helsinki"},{"id":"5783","title":"Kungsholmen","url":"https://www.brewdog.com/bars/worldwide/kungsholmen"},{"id":"8391","title":"Malmö","url":"https://www.brewdog.com/bars/worldwide/malm"},{"id":"8005","title":"Roma","url":"https://www.brewdog.com/bars/worldwide/roma"},{"id":"5778","title":"Roppongi","url":"https://www.brewdog.com/bars/worldwide/roppongi"},{"id":"5779","title":"São Paulo","url":"https://www.brewdog.com/bars/worldwide/sao-paulo"},{"id":"7487","title":"Södermalm","url":"https://www.brewdog.com/bars/worldwide/sodermalm"},{"id":"8941","title":"Tallinn","url":"https://www.brewdog.com/bars/worldwide/tallinn"}]`);



//Le functions
const getAllBars: Handler = (event: any, context: Context, callback: Callback) => {
  const response: BarsResponse = {
    statusCode: 200,
    body: JSON.stringify(allBars)
  };

  callback(undefined, response);
};

interface BarResponse {
  statusCode: number;
  body: string
}

const getBeersInBar: Handler = (event, context, callback) => {

  const barId = event.pathParameters.bar;

  fetchBeersForBarByBarId(barId).then( (bar) => {
    callback(undefined, { statusCode: 200, body: JSON.stringify(bar)});
  }).catch( (reason) => {
    callback(reason);
  })
}

export { getAllBars, getBeersInBar }