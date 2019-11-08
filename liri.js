// LIRI will search Spotify for songs, Bands in Town for concerts, and OMDB for movies.

require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var axios = require("axios");
var moment = require("moment")

var action = process.argv[2];
var userInput = process.argv;

var concertDetails = "";
var spotifyDetails = "";
var movieDetails = "";
var ratings = [];
var ratingNoBody = []

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
  // console.log(concertDetails)
  var queryUrl = "https://rest.bandsintown.com/artists/" + concertDetails + "/events?app_id=codingbootcamp"
  // console.log(queryUrl)
  axios.get(queryUrl).then(
    function(response) {
      // console.log(response.data);
      var resultLength = response.data.length
      for(var j = 0; j < resultLength; j++) {
        var thisDate = response.data[j].datetime
        var converted = moment(thisDate).format("ddd DD-MMM-YYYY, hh:mm A")
        console.log(`
          Venue's name: ${response.data[j].venue.name}
          Location: ${response.data[j].venue.city+", "+response.data[j].venue.country}
          Date: ${converted}
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

// SPOTIFY
function spotifyThis(){
  for (var i = 3; i < userInput.length; i++) {
    if (i > 3 && i < userInput.length) {
      spotifyDetails = spotifyDetails + userInput[i];
    } else {
      spotifyDetails += userInput[i];
    }
  }
  // console.log(spotifyDetails);
  spotify.search({ type: 'track', query: spotifyDetails})
    .then(function(response) {
      // console.log(response.tracks.items);
      console.log(`
        Artist: ${response.tracks.items[0].album.artists[0].name}
        Title: ${response.tracks.items[0].name} 
        Preview: ${response.tracks.items[0].external_urls.spotify}
        Album: ${response.tracks.items[0].album.name}
      `)
  })
  .catch(function(err) {
    console.log(err);
  });
  
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
  // console.log(movieDetails);
  var queryUrl = "http://www.omdbapi.com/?t=" + movieDetails + "&y=&plot=short&apikey=trilogy";
  // console.log(queryUrl)
  axios.get(queryUrl).then(
    function(response) {
      if(movieDetails === "") {
        var queryUrl = "http://www.omdbapi.com/?t=mr.nobody&y=&plot=short&apikey=trilogy";
        axios.get(queryUrl).then(
          function(response){
            // console.log(response)
            var resultLength = response.data.Ratings.length
            for(var j = 0; j < resultLength; j++){
              ratingNoBody.push(response.data.Ratings[j].Value); 
            }
            console.log(`
              You should watch 
        
              Title: ${response.data.Title}
              Year: ${response.data.Year}
              IMDB Rating: ${response.data.imdbRating}
              Rotten Tomatoes Rating: ${ratingNoBody}
              Country: ${response.data.Country}
              Language: ${response.data.Language}
              Plot: ${response.data.Plot}
              Actors: ${response.data.Actors}
              Link: http://www.imdb.com/title/tt0485947/
              It's also on Netflix
            `)
          })
      } else {
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
      }      
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

// it says 
function itSays(){
  
}