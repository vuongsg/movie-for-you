export class Search {
    Search: BriefMovie[];
    totalResults: string;
    Response: string;

    constructor(search: BriefMovie[], totalResults: string, response: string) {
        this.Search = search;
        this.totalResults = totalResults;
        this.Response = response;
    }
}

export class BriefMovie {
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;

    constructor(title: string, year: string, imdbID: string, type: string, poster: string) {
        this.Title = title;
        this.Year = year;
        this.imdbID = imdbID;
        this.Type = type;
        this.Poster = poster;
    }
}