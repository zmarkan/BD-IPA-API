import * as fs from 'fs';
import { fetchDetailsForBar } from '../src/bar_details_scraper';
import { Bar } from '../src/bar';

const scrapeFullBarDetails = async (bars: Array<Bar>) => {

  const fullBars = Array<Bar>();
    
    for (const bar of bars) {
      await fetchDetailsForBar(bar).then(fullBar => {
        
        if(fullBar){
          fullBars.push(fullBar)
        }
          
        else {
          console.warn(`Bar at ${bar.url} was not parsed successfully`);
        }
      });
    }

    return fullBars;
}

export { scrapeFullBarDetails };
