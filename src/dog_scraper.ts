
import * as cheerio from 'cheerio';
import * as request from 'request-promise';
import * as fs from 'fs';

const API_URL_BASE = "https://www.brewdog.com/ajax/tap_list.php?id="

const ANGEL_PUB_URL = "https://www.brewdog.com/bars/uk/angel";

const angel_pub_url = "https://www.brewdog.com/ajax/tap_list.php?id=9998"
let barId = "9998";

class Bar {
    
    name: string;
    id: string;
    categories : Array<Category> = new Array();

    constructor(barId: string){
        this.id = barId;
    }
}

class Category {
    title: string;
    beers: Array<Beer> = new Array();

    constructor(title: string){
        this.title = title;
    }
}

class Beer {
    name: String;
    type: String;
    brewery: String;
    abv: String;
}

  
  
const options = {
    uri: angel_pub_url,
    transform: function (body) {
      return cheerio.load(body);
    }
  };

request(options)
  .then(($) => {

        let bar = new Bar(barId);
        
        $("div[class=category]").each( function(i, elem) {
                
            let category = new Category($(this).find("div[class=title]").text());

            console.log(`Creating category: ${category.title}`);
            
            $(this).find("ul[class=beer]").each( function(i, elem) {

                let beer = new Beer();

                $(this).find("li").each( function(i, elem) {
                    
                    if(i === 0){
                        beer.name = $(this).find("span").text();
                    }
                    else if (i === 1){
                        beer.type = $(this).find("span").text();
                    }

                    else if( i === 2){
                        beer.brewery = $(this).find("span").first().text();
                        beer.abv = $(this).find("span").last().text();
                    }
                });

                console.log("Created beer:");
                console.log(beer);
                category.beers.push(beer);
            });

            console.log(`Created category: ${category}`);

            bar.categories.push(category);
        });



        console.log("Created the whole bar");
        console.log(bar);
});
