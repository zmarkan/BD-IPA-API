import * as request from 'request-promise';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import { BarBase } from './bars_parser';

const BASE_URL = "https://www.brewdog.com";
const BARS_JSON = "../static/bars.json";

const SAMPLE_HTML = `<div class="barDetails ">
<h2>Brewdog Angel</h2>
<div id="map" data-lat="51.5367656" data-lng="-0.1014557"></div>
<script src="https://maps.google.com/maps/api/js?sensor=false&libraries=places"></script>
<p>21-31 Essex Rd, London N1 2SA, UK</p>
<p>e: <a href="/cdn-cgi/l/email-protection#debfb0b9bbb2bcbfac9ebcacbba9bab1b9f0bdb1b3"><span class="__cf_email__" data-cfemail="ee8f80898b828c8f9cae8c9c8b998a8189c08d8183">[email&#160;protected]</span></a></p>
<p class="tel">t: 02073597474</p>
<p class="facebook">
<a href="https://facebook.com/brewdogangel" target="_blank"><i class="fa fa-facebook-square"></i>
 BrewDog Angel </a>
</p>
<p class="twitter"><a href="https://www.twitter.com/brewdogangel" target="_blank"><i class="fa fa-twitter"></i> @brewdogangel</a></p>
<p class="twitter"><a href="https://www.instagram.com/brewdogangel" target="_blank"><i class="fa fa-instagram"></i> @brewdogangel</a></p>
<div class="openingHours">
<h4>Got Feedback?</h4>
<p>Let us know here!</p>
<a href="/cdn-cgi/l/email-protection#3b5d5e5e5f595a58507b59495e4c5f545c15585456"><span class="__cf_email__" data-cfemail="89efececedebe8eae2c9ebfbecfeede6eea7eae6e4">[email&#160;protected]</span></a>
</div>
<div class="openingHours">
<h4>Opening Hours</h4>
<table class="opening-hours"> <tbody> <tr><th>Monday</th><td>12:00 - 23:00</td></tr> <tr><th>Tuesday</th><td>12:00 - 23:00</td></tr> <tr><th>Wednesday</th><td>12:00 - 23:00</td></tr> <tr><th>Thursday</th><td>12:00 - 23:00</td></tr> <tr><th>Friday</th><td>12:00 - 23:00</td></tr> <tr><th>Saturday</th><td>12:00 - 23:00</td></tr> <tr><th>Sunday</th><td>12:00 - 23:00</td></tr> </tbody></table> </div>
<div class="livingWage bar ">
<a href="/about/work-for-brewdog"><img src="/images/layout/livingwage.png" alt="We are a living wage employer" /></a>
</div>
</div>`

export type Bar = {
    id: string;
    title: string;
    url: string,

    opening_hours: [
        {
            day: string,
            timeOpen: string,
            timeClose: string
        }
    ],

    social: [
        {
            network: string,
            handle: string
            url: string
        }
    ],

    contact_details: {
        address: string[],
        email: string,
        telephone: string,
        location: {
            lat: string,
            lng: string
        }
    }
}

const fullBars = Array<Bar>();

let baseBars = fs.readFileSync("../static/bars.json").toJSON().data as Array<BarBase>;
baseBars.forEach( bar => fullBars.push(requestBarDetails(bar)));
fs.writeFileSync("../static/bars-full.json", JSON.stringify(fullBars));

let requestBarDetails = (barBase: BarBase): Bar => {
    let fullBar: Bar = {} as Bar;

    request({
        uri: barBase.url,
       transform: function (body: any) {
           return cheerio.load(body);
       }
   }).then( ($: CheerioAPI) => {

        let barDeetsHtml = $("div.barDetails");

        let mapHtml = $(barDeetsHtml).find("div#map");
        fullBar.contact_details.location.lat = mapHtml.attr("data-lat");
        fullBar.contact_details.location.lat = mapHtml.attr("data-lng");

        let addr = $(barDeetsHtml).find("script[src=https://maps.google.com/maps/api/js?sensor=false&libraries=places]").next().text();
        fullBar.contact_details.address = addr.split(",");

        let tel = $(barDeetsHtml).find("p.tel").text();
        fullBar.contact_details.telephone = tel;

        //Email - needs to be decoded because fuck yeah
        let encodedEmail = $(barDeetsHtml).find("span.__cf_email__").attr("data-cfemail");
        fullBar.contact_details.email = cfDecodeEmail(encodedEmail);

        //SOCIAL

        let fbHtml = $(barDeetsHtml).find("a[href*=facebook\\.com]");
        if(fbHtml.length == 1 ){
            fullBar.social.push( {
                network: "facebook",
                handle: fbHtml.text(),
                url: fbHtml.attr("href")
            });
        }

        let twitterHtml = $(barDeetsHtml).find("a[href*=twitter\\.com]");
        if(twitterHtml.length == 1) {
            fullBar.social.push( {
                network: "twitter",
                handle: twitterHtml.text(),
                url: twitterHtml.attr("href")
            });
        }

        let instaHtml = $(barDeetsHtml).find("a[href*=instagram\\.com]");
        if(instaHtml.length == 1) {
            fullBar.social.push( {
                network: "instagram",
                handle: instaHtml.text(),
                url: twitterHtml.attr("href")
            });
        }
        
        //Opening hours
        let openingHoursTable = $(barDeetsHtml).find("table.opening-hours");
        let openingHoursTableRows = $(openingHoursTable).find("tr");
        openingHoursTableRows.each( (index, row) => {
            let day = $(row).find("th").text();
            let times = $(row).find("td").text().split("-");

            fullBar.opening_hours.push({
                day: day,
                timeOpen: times[0].trim(),
                timeClose: times[1].trim()
            });
        });


   });
    return fullBar;
}

//Cloudflare email hack. Taken from https://usamaejaz.com/cloudflare-email-decoding/
function cfDecodeEmail(encodedString: string): string {
    var email = "", r = parseInt(encodedString.substr(0, 2), 16), n, i;
    for (n = 2; encodedString.length - n; n += 2){
    	i = parseInt(encodedString.substr(n, 2), 16) ^ r;
		email += String.fromCharCode(i);
    }
    return email;
}


