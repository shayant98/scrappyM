const fetch = require('node-fetch');
const cheerio = require('cheerio');


const Searchurl = "https://www.imdb.com/find?s=tt&ttype=ft&ref_=fn_ft&q=";
const Movieurl = "https://www.imdb.com/title/";

function searchMovies(searchTerm) {
    return fetch(`${Searchurl}${searchTerm}`)
        .then(response => response.text())
        .then(body =>
        {
            const $ = cheerio.load(body);
            const movies = [];
            $('.findResult').each( (i, element) => {
                const $element = $(element);
                const image = $element.find('.primary_photo a img');
                const title  =$element.find('.result_text a');
                const movieId = title.attr('href').match(/title\/(.*)\//)[1];
                const movie = {
                    movieId,
                    image : image.attr('src'),
                    title : title.text(),

                };
                movies.push(movie);
            });
            return movies;
        })
}


function getMovie(movieId){
    return fetch(`${Movieurl}${movieId}`)
        .then(response => response.text())
        .then(body => {
            const $ = cheerio.load(body);
            const title =  $(".title_wrapper h1").clone().children().remove().end().text().trim(); //get only title not year

            const year = $("#titleYear").text().trim();
            const summary = $(".summary_text").text().trim();
            const metaCriticScore = $(".metacriticScore").text().trim();
            const poster = $(".poster a img").attr('src');

            return {
                title,
                year,
                summary,
                metaCriticScore,
                poster
           }
        })
}
function getMovieCast(movieId){
    return fetch(`${Movieurl}${movieId}/fullcredits`)
        .then(response => response.text())
        .then(body => {
            const actors = [];
            const $ = cheerio.load(body);
            const directors = [];
            const writers = [];
            $(".simpleTable tbody tr").eq(1).each((i, row) => {
                $row = $(row);
                const directorName = $row.find('.name a').text().trim();
                const director =  {
                    directorName
                };
                directors.push(director);
            });
            $(".simpleTable:nth-child(2) tbody tr").each((i, row) => {
                $row = $(row);
                const writerName = $row.find('.name a').text().trim();
                const writer =  {
                    writerName
                };
                writers.push(writer);
            });
            $(".cast_list tr").not(':first-child').each((i, row) => {
                $row = $(row);

                const actorName = $row.find('td:not(.character):not(.ellipsis):not(.primary_photo)').text().trim();
                const actorRole = $row.find('.character a').text().trim();
                const roleLink = $row.find('.character a').attr('href');
                const actor = {
                    actorName,
                    actorRole,
                    roleLink
                };
                actors.push(actor);
            })
            return {
                directors,
                writers,
                actors
            };
        })
}

module.exports = {
    searchMovies,
    getMovie,
    getMovieCast
}