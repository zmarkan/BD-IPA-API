import * as request from 'request-promise';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

const BASE_URL = "https://www.brewdog.com";
const BARS_UK_SUFFIX = "/bars/uk";

type Bar = {
    id: string;
    title: string;
    url: string
}

const options = {
    uri: BASE_URL + BARS_UK_SUFFIX ,
    transform: function (body: any) {
      return cheerio.load(body);
    }
};

request(options)
    .then( ($: CheerioAPI) => {

        let allBars = Array<Bar>();

        $("ul.sideNav > li").each( (n, elem) => {

            let link = $(elem).find("a");
            let title = $(link).attr("title").trim();

            //Remove all invalid entries
            if(
                title != "UK" &&  //UK top section
                title != "USA" &&  //US top section
                title != "International" && //You get the drift.
                title != "Coming Soon" && 
                !$(link).attr("href").includes("coming-soon")){ //

                    let url =  BASE_URL + $(link).attr("href").trim();
                    let id = $(link).attr("id").match(/[0-9]+/)[0];

                    allBars.push( {
                        id: id,
                        title: title,
                        url: url
                    });
            }
        });

        fs.writeFile('static/bars.json', JSON.stringify(allBars), (err) => {
            console.log(err);
        });
    }
);


