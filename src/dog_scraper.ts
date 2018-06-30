import * as request from 'request-promise';
import * as cheerio from 'cheerio';

const API_URL_BASE = "https://www.brewdog.com/ajax/tap_list.php?id="

//Models
export class Bar {
    id: string;

    name?: string;
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
    name?: string;
    type?: string;
    brewery?: string;
    abv?: string;
}
 

//That's where the magic happens
export function fetchBeersForBarByBarId(barId: string) {

    const options = {
        uri: API_URL_BASE + barId ,
        transform: function (body: any) {
          return cheerio.load(body);
        }
      };

    return request(options)
    .then(($: CheerioAPI) => {
  
          let bar = new Bar(barId);
          
          $("div[class=category]").each( function(i, elem) {
              
              let category = new Category($(elem).find("div[class=title]").text());
              
  
              $(elem).find("ul[class=beer]").each( function(i, elem) {
  
                  let beer = new Beer();
  
                  $(elem).find("li").each( function(i, elem) {
                      
                      if(i === 0){
                          beer.name = $(elem).find("span").text();
                      }
                      else if (i === 1){
                          beer.type = $(elem).find("span").text();
                      }
  
                      else if( i === 2){
                          beer.brewery = $(elem).find("span").first().text();
                          beer.abv = $(elem).find("span").last().text();
                      }
                  });
                  category.beers.push(beer);
              });
  
              bar.categories.push(category);
          });
  
          return bar;
  });    
}

