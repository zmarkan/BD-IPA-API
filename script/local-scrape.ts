import { scrapeFullBarDetails } from '../src/full_bar_details_scraper';
import { fetchBarsList } from '../src/bucketeer';
import { scrapeBars } from '../src/bars_scraper';
import { fetchDetailsForBar } from '../src/bar_details_scraper';


scrapeBars()
    .then( bars => scrapeFullBarDetails(bars))
    .then( fullBars => {
        console.log(fullBars.length);
    })
    .catch( err => {
        console.log(err);
    })


    // fetchDetailsForBar( { 
    //     id: "10061",
    //     title: "Aberdeen",
    //     url: "https://www.brewdog.com/bars/uk/aberdeen"
    // }).then( bar => {

    //     if(bar){
    //         console.log(bar);
    //     }
    //     else{
    //         console.log("no bar");
    //     }
    
    // })
    // .catch( err => {

    //     console.log("fail at promises");
    //     console.log(err);
    // })
