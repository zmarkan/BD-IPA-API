# Brewdog IPA API - an API for BrewDog bars.

Or maybe just an experiment in serverless and making a little ScrAPI. Who knows?

## Usage

The service lives at `https://api.ipa-api.net/brewdog` and has two GET endpoints:

    - `/bars` gets you all active Brewdog bars, their urls, and their IDs.
    - `/bars/{id}` for the details of a particular Brewdog bar, including location, opening hours and social links
    - `/ontap/{id}` for everything on tap today!

Try going to `https://api.ipa-api.net/brewdog/ontap/5909` to see what's on tap in Brewdog Shoreditch today!

## Dev stuff

There are two components:

- Serverless service with the three endpoints.
- A scraper/parser script that retrieves all the bars. Presumably this changes a few times a year only.

Everything is deployed on AWS, mostly following the [docs on the Serverless framework](https://serverless.com/framework/docs/providers/aws/guide/quick-start/).

To deploy, you need the AWS profile and all that. It also uses a custom domain to deploy to.