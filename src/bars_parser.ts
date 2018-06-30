import * as cheerio from 'cheerio';
import * as request from 'request-promise';
import * as fs from 'fs';

const API_URL_BASE = "https://www.brewdog.com/ajax/tap_list.php?id="

const ANGEL_PUB_URL = "https://www.brewdog.com/bars/uk/angel";

const angel_pub_url = "https://www.brewdog.com/ajax/tap_list.php?id=9998"

let bars_html = fs.readFileSync("static/sidebar_uk.html").toString();

let $ = cheerio.load(bars_html);

// <a id="item_9998_a" title="Angel" href="/bars/uk/angel">
let links = $('a')

let bars = [];

links.each( (index, link) => {


    
    let bar = {
        title: "", 
        id: ""
    };

    bar.title = link.attribs.title;
    bar.id = link.attribs.id.match(/[0-9]+/)[0];
    bars.push(bar);
});




fs.writeFile('static/bars.json', JSON.stringify(bars), (err) => {

    console.log(err);

});


