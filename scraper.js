const fetch = require('node-fetch');
const cheerio = require('cheerio');


const url = "https://www.imdb.com/find?s=tt&ttype=ft&ref_=fn_ft&q=";

function searchMovies(searchTerm) {
    return fetch(`${url}${searchTerm}`)
        .then(response => response.text())
        .catch()
}

searchMovies('star wars').then(body =>
{
    const $ = cheerio.load(body);
    const movies = []
    $('.findResult').each( (i, element) => {
        const $element = $(element);
        const $image = $element.find('.primary_photo a img');
        const $title  =$element.find('.result_text a');
        const movie = {
            image : $image.attr('src'),
            title : $title.text(),
        };
        movies.push(movie);
    })
    console.log(movies);
});