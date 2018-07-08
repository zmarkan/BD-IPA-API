import { parseBeersFromBar } from './on_tap_scraper';
import * as cheerio from 'cheerio';
import * as fs from 'fs';


const MALMO_HTML = fs.readFileSync("static.test/onTap_malmo.htm").toString();
const ANGEL_HTML = fs.readFileSync("static.test/onTap_angel.htm").toString();

test("Parse beers from Angel bar correctly", () => {

    let $ = cheerio.load(ANGEL_HTML);
    let barId = "9998";

    let angel = parseBeersFromBar(barId, $);

    expect(angel.barId).toBe(barId);
    expect(angel.categories).toHaveLength(3);

    let headliners = angel.categories[0];
    expect(headliners.title).toBe("Headliners");
    expect(headliners.beers).toHaveLength(5);

    expect(headliners.beers).toContainEqual(JSON.parse(
       
        `{
        "name": "Jet Black Heart",
        "type": "Stout - Milk / Sweet",
        "brewery": "BrewDog",
        "abv": "4.7% ABV"
        }`

    ));

    expect(headliners.beers).toContainEqual(JSON.parse(

        `{
            "name": "Dead Pony Club",
            "type": "Pale Ale - American",
            "brewery": "BrewDog",
            "abv": "3.8% ABV"
            }`
            
    ));


    let moreBrewdog = angel.categories[1];
    expect(moreBrewdog.title).toBe("More BrewDog");
    expect(moreBrewdog.beers).toHaveLength(5);

    expect(moreBrewdog.beers).toContainEqual(JSON.parse(

        `{
            "name": "King of Eights V2 - Double Dry-Hop Edition",
            "type": "IPA - New England",
            "brewery": "BrewDog",
            "abv": "7.4% ABV"
            }`

    ));


    let guestDraft = angel.categories[2];
    expect(guestDraft.title).toBe("Guest Draft");
    expect(guestDraft.beers).toHaveLength(4);

    expect(guestDraft.beers).toContainEqual(JSON.parse(

        `{
            "name": "Green Path IPA - Citra, Mosaic & Enigma",
            "type": "IPA - American",
            "brewery": "Burnt Mill Brewery",
            "abv": "6.0% ABV"
        }`

    ));
});

test("Parse beers from Malmo bar correctly", () => {

    let $ = cheerio.load(MALMO_HTML);
    let barId = "8391";

    let malmo = parseBeersFromBar(barId, $);

    expect(malmo.barId).toBe(barId);
    expect(malmo.categories).toHaveLength(5);

    let guestDraft = malmo.categories[2];
    expect(guestDraft.title).toBe("guest draft");
    expect(guestDraft.beers).toHaveLength(9);

    expect(guestDraft.beers).toContainEqual(JSON.parse(

        `{
            "name": "Go To IPA",
            "type": "IPA",
            "brewery": "Stone Brewing",
            "abv": "4,7% ABV"
            }`

    ));


    expect(guestDraft.beers).toContainEqual(JSON.parse(

        `{
            "name": "Starman DIPA",
            "type": "Double IPA",
            "brewery": "Brewski",
            "abv": "8,0% ABV"
            }`

    ));
});