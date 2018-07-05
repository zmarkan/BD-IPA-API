export class OnTap {
    barId: string;
    barName?: string;
    categories: Array<Category> = new Array();
    constructor(barId: string) {
        this.barId = barId;
    }
}
export class Category {
    title: string;
    beers: Array<Beer> = new Array();
    constructor(title: string) {
        this.title = title;
    }
}
export class Beer {
    name?: string;
    type?: string;
    brewery?: string;
    abv?: string;
}