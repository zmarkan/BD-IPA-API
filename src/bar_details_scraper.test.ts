import * as cheerio from 'cheerio';
import * as fs from 'fs';
import { parseDetailsFromRequest } from './bar_details_scraper';
import { Bar } from './bar';

const ANGEL_HTML = fs.readFileSync("static.test/bar_angel.htm").toString();
const MALMO_HTML = fs.readFileSync("static.test/bar_malmo.htm").toString();

test("Parse details dfrom Angel bar correctly", () => {

    let $ = cheerio.load(ANGEL_HTML);
    let input: Bar = {
        "id": "9998",
        "title": "Angel",
        "url": "https://www.brewdog.com/bars/uk/angel"
    };

    let angel = parseDetailsFromRequest(input, $);

    expect(angel.id).toBe("9998");
    expect(angel).toEqual(JSON.parse(

        `{
            "id": "9998",
            "title": "Angel",
            "url": "https://www.brewdog.com/bars/uk/angel",
            "contact_details": {
            "location": {
            "lat": "51.5367656",
            "lng": "-0.1014557"
            },
            "address": [
            "21-31 Essex Rd",
            "London N1 2SA",
            "UK"
            ],
            "telephone": "t: 02073597474",
            "email": "angelbar@brewdog.com"
            },
            "social": [
            {
            "network": "facebook",
            "handle": "BrewDog Angel",
            "url": "https://facebook.com/brewdogangel"
            },
            {
            "network": "twitter",
            "handle": "@brewdogangel",
            "url": "https://www.twitter.com/brewdogangel"
            },
            {
            "network": "instagram",
            "handle": "@brewdogangel",
            "url": "https://www.instagram.com/brewdogangel"
            }
            ],
            "opening_hours": [
            {
            "day": "Monday",
            "times": "12:00 - 23:00"
            },
            {
            "day": "Tuesday",
            "times": "12:00 - 23:00"
            },
            {
            "day": "Wednesday",
            "times": "12:00 - 23:00"
            },
            {
            "day": "Thursday",
            "times": "12:00 - 23:00"
            },
            {
            "day": "Friday",
            "times": "12:00 - 23:00"
            },
            {
            "day": "Saturday",
            "times": "12:00 - 23:00"
            },
            {
            "day": "Sunday",
            "times": "12:00 - 23:00"
            }
            ]
            }`
    ));

});


test("Parse details dfrom Malmo bar correctly", () => {
    let $ = cheerio.load(MALMO_HTML);
    let input: Bar = {
        "id": "8391",
        "title": "Malmö",
        "url": "https://www.brewdog.com/bars/worldwide/malm"
    };

    let malmo = parseDetailsFromRequest(input, $);
    expect(malmo.id).toBe("8391");
    expect(malmo).toEqual(JSON.parse(

        `{
            "id": "8391",
            "title": "Malmö",
            "url": "https://www.brewdog.com/bars/worldwide/malm",
            "contact_details": {
            "location": {
            "lat": "55.604763",
            "lng": " 13.004947"
            },
            "address": [
            "Baltzarsgatan 25",
            "211 36 Malmö",
            "Sweden"
            ],
            "telephone": "t: 040-17 20 00 (drop us an email if we miss your call)",
            "email": "malmo@brewdog.com"
            },
            "social": [
            {
            "network": "facebook",
            "handle": "BrewDog Malmö",
            "url": "https://www.facebook.com/BrewDogMalmo/"
            },
            {
            "network": "twitter",
            "handle": "@BrewDogMalmo",
            "url": "https://www.twitter.com/BrewDogMalmo"
            },
            {
            "network": "instagram",
            "handle": "@brewdogmalmo",
            "url": "https://www.instagram.com/brewdogmalmo"
            }
            ],
            "opening_hours": [
            {
            "day": "Monday",
            "times": "16.00 - 23.00 "
            },
            {
            "day": "Tuesday",
            "times": "16.00 - 00.00"
            },
            {
            "day": "Wednesday",
            "times": "16.00 - 00.00"
            },
            {
            "day": "Thursday",
            "times": "16.00 - 00.00"
            },
            {
            "day": "Friday",
            "times": "14.00 - 01.00"
            },
            {
            "day": "Saturday",
            "times": "14.00 - 01.00"
            },
            {
            "day": "Sunday",
            "times": "14.00 - 23.00"
            }
            ]
            }`

    ));

});