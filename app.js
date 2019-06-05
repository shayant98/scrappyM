const express = require("express");
const scraper = require("./scraper");

const app = express();

app.get("/", (req, res, next) => {
  res.json({
    message: "Scraping"
  });
});
// /search/star wars
app.get("/search/:title", (req, res, next) => {
  scraper.searchMovies(req.params.title).then(movies => {
    res.json(movies);
  });
});
app.get("/movie/:movieId", (req, res, next) => {
  scraper.getMovie(req.params.movieId).then(movieData => {
    res.json(movieData);
  });
});
app.get("/fullcast/:movieId", (req, res, next) => {
  scraper.getFullMovieCast(req.params.movieId).then(castData => {
    res.json(castData);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
