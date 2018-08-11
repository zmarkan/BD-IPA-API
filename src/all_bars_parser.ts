import * as fs from 'fs';
import { fetchDetailsForBar } from '../src/bar_details_scraper';
import { Bar } from '../src/bar';

let fetchDetailsForAllBars = () => {

    fs.readFile("static/bars.json", (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
  
      let baseBars = JSON.parse(data.toString()) as Array<Bar>;
      const fullBars = Array<Bar>();
  
      async function processBarsArray(bars: Array<Bar>) {
        for (const bar of bars) {
          await fetchDetailsForBar(bar).then(fullBar => fullBars.push(fullBar));
        }
  
        fs.writeFileSync("static/bars-full.json", JSON.stringify(fullBars));
        console.log(`Written ${fullBars.length} bars`);
      }
  
      processBarsArray(baseBars);
    });
}

fetchDetailsForAllBars();
