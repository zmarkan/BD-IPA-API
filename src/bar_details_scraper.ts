import * as request from "request-promise";
import * as cheerio from "cheerio";
import { Bar, Social, OpeningHours, ContactDetails } from './bar';

const parseDetailsFromRequest = (bar: Bar, $: CheerioAPI) => {

  let barDeetsHtml = $("div.barDetails");

    let mapHtml = $(barDeetsHtml).find("div#map");
    let location = {
      lat: mapHtml.attr("data-lat"),
      lng: mapHtml.attr("data-lng")
    };

    let addr: string[] = [];
    $(barDeetsHtml)
      .find("script[src*=maps\\.google\\.com]")
      .next()
      .text()
      .split(",")
      .forEach(addressLine => {
        addressLine = addressLine.trim();
        if(addressLine) addr.push(addressLine);
      });
    // addr.forEach(item => item.trim());
    // fullBar.contact_details.address = addr.split(",");

    let tel = $(barDeetsHtml)
      .find("p.tel")
      .text();
    // fullBar.contact_details.telephone = tel;

    //Email - needs to be decoded because fuck yeah
    let encodedEmail = $(barDeetsHtml)
      .find("span.__cf_email__")
      .attr("data-cfemail");
    let email = cfDecodeEmail(encodedEmail);

    let contactDetails: ContactDetails = {
      location: location,
      address: addr,
      telephone: tel,
      email: email
    };

    bar.contact_details = contactDetails;

    //SOCIAL

    let social = [] as Social[];

    let fbHtml = $(barDeetsHtml).find("a[href*=facebook\\.com]");
    if (fbHtml.length == 1) {
      social.push({
        network: "facebook",
        handle: fbHtml.text().trim(),
        url: fbHtml.attr("href")
      });
    }

    let twitterHtml = $(barDeetsHtml).find("a[href*=twitter\\.com]");
    if (twitterHtml.length == 1) {
      social.push({
        network: "twitter",
        handle: twitterHtml.text().trim(),
        url: twitterHtml.attr("href")
      });
    }

    let instaHtml = $(barDeetsHtml).find("a[href*=instagram\\.com]");
    if (instaHtml.length == 1) {
      social.push({
        network: "instagram",
        handle: instaHtml.text().trim(),
        url: instaHtml.attr("href")
      });
    }

    bar.social = social;

    //Opening hours

    let openingHours = [] as OpeningHours[];

    let openingHoursTable = $(barDeetsHtml).find("table.opening-hours");
    let openingHoursTableRows = $(openingHoursTable).find("tr");

    openingHoursTableRows.each((index, row) => {
      let day = $(row)
        .find("th")
        .text();
      if (day) {
        let times = $(row)
          .find("td")
          .text();

        openingHours.push({
          day: day,
          times: times
        });
      }
    });
    bar.opening_hours = openingHours;

    return bar;
}

export const fetchDetailsForBar = (inBar: Bar) =>  {
  let bar: Bar = {} as Bar;
  
  bar.id = inBar.id;
  bar.title = inBar.title;
  bar.url = inBar.url;

  const options = {
    uri: inBar.url,
    transform: function(body: any) {
      return cheerio.load(body);
    }
  };

  return request(options).then(($: CheerioAPI) => parseDetailsFromRequest(bar, $));
};

//Cloudflare email hack. Taken from https://usamaejaz.com/cloudflare-email-decoding/
function cfDecodeEmail(encodedString: string): string {
  var email = "",
    r = parseInt(encodedString.substr(0, 2), 16),
    n,
    i;
  for (n = 2; encodedString.length - n; n += 2) {
    i = parseInt(encodedString.substr(n, 2), 16) ^ r;
    email += String.fromCharCode(i);
  }
  return email;
}




