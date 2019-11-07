// LIRI will search Spotify for songs, Bands in Town for concerts, and OMDB for movies.

// require("dotenv").config();
// var keys = require("./keys.js");
// var spotify = new Spotify(keys.spotify);

var axios = require("axios");

var action = process.argv[2];
var userInput = process.argv;

var concertDetails = "";
var spotifyDetails = "";
var movieDetails = "";
var ratings = [];

switch (action) {
  case "concert-this":
    concertThis();
    break;
  
  case "spotify-this-song":
    spotifyThis();
    break;
  
  case "movie-this":
    movieThis();
    break;
  
  case "do-what-it-says":
    itSays();
    break;
}

// CONCERT
function concertThis(){
  for (var i = 3; i < userInput.length; i++) {
    if (i > 3 && i < userInput.length) {
      concertDetails = concertDetails + userInput[i];
    } else {
      concertDetails += userInput[i];
    }
  }
  console.log(concertDetails)
  var queryUrl = "https://rest.bandsintown.com/artists/" + concertDetails + "/events?app_id=codingbootcamp"
  console.log(queryUrl)
  axios.get(queryUrl).then(
    function(response) {
      console.log(response.data);
      // console.log(response.data.length)
      // console.log(response.data[0].venue)
      var resultLength = response.data.length
      for(var j = 0; j < resultLength; j++) {
        console.log(`
          Venue's name: ${response.data[j].venue.name}
          Location: ${response.data[j].venue.country +", "+ response.data[j].venue.city}
          Date: ${response.data[j].datetime}
        `)
      }
    }).catch(function(error) {
      if (error.response) {
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    });  
}
function spotifyThis(){
  for (var i = 3; i < userInput.length; i++) {
    if (i > 3 && i < userInput.length) {
      spotifyDetails = spotifyDetails + userInput[i];
    } else {
      spotifyDetails += userInput[i];
    }
  }
  console.log(spotifyDetails);
  
}


// MOVIE
function movieThis(){
  for (var i = 3; i < userInput.length; i++) {
    if (i > 3 && i < userInput.length) {
      movieDetails = movieDetails + "+" + userInput[i];
    } else {
      movieDetails += userInput[i];
    }
  }
  console.log(movieDetails);
  var queryUrl = "http://www.omdbapi.com/?t=" + movieDetails + "&y=&plot=short&apikey=trilogy";
  console.log(queryUrl)
  axios.get(queryUrl).then(
    function(response) {
      // console.log(response.data);
      var resultLength = response.data.Ratings.length
      for(var j = 0; j < resultLength; j++){
        ratings.push(response.data.Ratings[j].Value); 
      }
      console.log(`
        Title: ${response.data.Title}
        Year: ${response.data.Year}
        IMDB Rating: ${response.data.imdbRating}
        Rotten Tomatoes Rating: ${ratings}
        Country: ${response.data.Country}
        Language: ${response.data.Language}
        Plot: ${response.data.Plot}
        Actors: ${response.data.Actors}
      `)
    })
    .catch(function(error) {
      if (error.response) {
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
}
