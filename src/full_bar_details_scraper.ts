import * as fs from 'fs';
import { fetchDetailsForBar } from '../src/bar_details_scraper';
import { Bar } from '../src/bar';
import { reject } from '../node_modules/@types/bluebird';

const scrapeFullBarDetails = async (bars: Array<Bar>) => {

  const fullBars = Array<Bar>();
    
    for (const bar of bars) {
      await fetchDetailsForBar(bar).then(fullBar => fullBars.push(fullBar));
    }

    return fullBars;
}

export { scrapeFullBarDetails };
