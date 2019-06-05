const fetch = require("node-fetch");
const cheerio = require("cheerio");

const Searchurl = "https://www.imdb.com/find?s=tt&ttype=ft&ref_=fn_ft&q=";
const Movieurl = "https://www.imdb.com/title/";

function searchMovies(searchTerm) {
  return fetch(`${Searchurl}${searchTerm}`)
    .then(response => response.text())
    .then(body => {
      const $ = cheerio.load(body);
      const movies = [];
      $(".findResult").each((i, element) => {
        const $element = $(element);
        const image = $element.find(".primary_photo a img");
        const title = $element.find(".result_text a");
        const movieId = title.attr("href").match(/title\/(.*)\//)[1];
        const movie = {
          movieId,
          image: image.attr("src"),
          title: title.text()
        };
        movies.push(movie);
      });
      return movies;
    });
}

function getMovie(movieId) {
  return fetch(`${Movieurl}${movieId}`)
    .then(response => response.text())
    .then(body => {
      const actors = [];
      const $ = cheerio.load(body);
      const title = $(".title_wrapper h1")
        .clone()
        .children()
        .remove()
        .end()
        .text()
        .trim(); //get only title not year

      const year = $("#titleYear")
        .text()
        .trim();
      const summary = $(".summary_text")
        .text()
        .trim();
      const metaCriticScore = $(".metacriticScore")
        .text()
        .trim();
      const imdbRating = $("span[itemprop='ratingValue']")
        .text()
        .trim();
      const poster = $(".poster a img").attr("src");
      $(".cast_list tr")
        .not(":first-child")
        .each((i, row) => {
          $row = $(row);

          const actorName = $row
            .find("td:not(.character):not(.ellipsis):not(.primary_photo)")
            .text()
            .trim();
          const actorRole = $row
            .find(".character")
            .text()
            .trim()
            .replace(/\s\s+/g, " ");
          const roleLink = $row.find(".character a").attr("href");
          if (roleLink != undefined) {
            roleId = roleLink.match(/characters\/(.*)\?/)[1];
          } else {
            roleId = null;
          }
          const actor = {
            actorName,
            actorRole,
            roleId
          };
          actors.push(actor);
        });
      return {
        title,
        year,
        summary,
        metaCriticScore,
        imdbRating,
        poster,
        actors
      };
    });
}
function getFullMovieCast(movieId) {
  return fetch(`${Movieurl}${movieId}/fullcredits`)
    .then(response => response.text())
    .then(body => {
      const directors = [];
      const writers = [];
      const producers = [];
      const musicians = [];
      const actors = [];
      const $ = cheerio.load(body);
      const directorTable = $(".simpleTable").eq(0);
      const writerTable = $(".simpleTable").eq(1);
      const producersTable = $(".simpleTable").eq(2);
      const musicianTable = $(".simpleTable").eq(3);
      directorTable.find("tbody .name a").each((i, row) => {
        $row = $(row);
        const directorName = $row.text().trim();
        const director = {
          directorName
        };
        directors.push(director);
      });
      writerTable.find("tbody .name a").each((i, row) => {
        $row = $(row);
        const writerName = $row.text().trim();
        const writerCredit = $row
          .parent()
          .parent()
          .children(".credit")
          .text()
          .trim();
        const writer = {
          writerName,
          writerCredit
        };
        writers.push(writer);
      });
      producersTable.find("tbody .name a").each((i, row) => {
        $row = $(row);
        const producerName = $row.text().trim();
        const producerCredit = $row
          .parent()
          .parent()
          .children(".credit")
          .text()
          .trim();
        const producer = {
          producerName,
          producerCredit
        };
        producers.push(producer);
      });
      musicianTable.find("tbody .name a").each((i, row) => {
        $row = $(row);
        const musicianName = $row.text().trim();
        const musicianCredit = $row
          .parent()
          .parent()
          .children(".credit")
          .text()
          .trim();
        const musician = {
          musicianName,
          musicianCredit
        };
        musicians.push(musician);
      });
      $(".cast_list tr")
        .not(":first-child")
        .each((i, row) => {
          $row = $(row);

          const actorName = $row
            .find("td:not(.character):not(.ellipsis):not(.primary_photo)")
            .text()
            .trim();
          const actorRole = $row
            .find(".character")
            .text()
            .trim()
            .replace(/\s\s+/g, " ");
          const roleLink = $row.find(".character a").attr("href");
          if (roleLink != undefined) {
            roleId = roleLink.match(/characters\/(.*)\?/)[1];
          } else {
            roleId = null;
          }
          const actor = {
            actorName,
            actorRole,
            roleId
          };
          actors.push(actor);
        });
      return {
        directors,
        writers,
        producers,
        musicians,
        actors
      };
    });
}

module.exports = {
  searchMovies,
  getMovie,
  getFullMovieCast
};
