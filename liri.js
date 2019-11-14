// LIRI will search Spotify for songs, Bands in Town for concerts, and OMDB for movies.

require("dotenv").config();

var keys = require("./keys.js");
var fs = require("fs");
var axios = require("axios");
var moment = require("moment")

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var action = process.argv[2];
var userInput = process.argv.slice(3).join(" ");

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
  var queryUrl = "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp"
  // console.log(queryUrl)
  axios.get(queryUrl).then(
    function(response) {
      // console.log(response.data);
      var resultLength = response.data.length
      for(var j = 0; j < resultLength; j++) {
        var thisDate = response.data[j].datetime
        var converted = moment(thisDate).format("ddd DD-MMM-YYYY, hh:mm A")
        const concert = `
          Venue's name: ${response.data[j].venue.name}
          Location: ${response.data[j].venue.city+", "+response.data[j].venue.country}
          Date: ${converted}
        `
        fs.appendFile("./log.txt", concert, function(err) {
          if (err)
            return console.error(err);
          console.log(concert);
        });
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

// SPOTIF1
function spotifyThis(a){
  spotify.search({ type: 'track', query: userInput || a || `"The Sign"`})
    .then(function(response) {
      console.log(userInput)
      if (userInput === ""){
        const sign = `
          Artist: ${response.tracks.items[1].album.artists[0].name}
          Title: ${response.tracks.items[1].name} 
          Preview: ${response.tracks.items[1].external_urls.spotify}
          Album: ${response.tracks.items[1].album.name}
        `
        fs.appendFile("./log.txt", sign, function(err) {
          if (err)
            return console.error(err);
          console.log(sign);
        });
      } else {
        const songs = `
          Artist: ${response.tracks.items[0].album.artists[0].name}
          Title: ${response.tracks.items[0].name} 
          Preview: ${response.tracks.items[0].external_urls.spotify}
          Album: ${response.tracks.items[0].album.name}
        `
        fs.appendFile("./log.txt", songs, function(err) {
          if (err)
            return console.error(err);
          console.log(songs);
        });
      }
      // console.log(response.tracks);
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

// MOVIE
function movieThis(){
  var queryUrl = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy";
  // console.log(queryUrl)
  axios.get(queryUrl).then(
    function(response) {
      var queryUrl = "http://www.omdbapi.com/?t=mr.nobody&y=&plot=short&apikey=trilogy";
      if(userInput === "") {
        axios.get(queryUrl).then(
          function(response){
            // console.log(response)
            var resultLength = response.data.Ratings.length
            for(var j = 0; j < resultLength; j++){
              ratingNoBody.push(response.data.Ratings[j].Value); 
            }
            const noBody = `
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
            `
            fs.appendFile("./log.txt", noBody, function(err) {
              if (err)
                return console.error(err);
              console.log(noBody);
            });
          })
      } else {
      var resultLength = response.data.Ratings.length
      for(var j = 0; j < resultLength; j++){
        ratings.push(response.data.Ratings[j].Value); 
      }
      const movie = `
        Title: ${response.data.Title}
        Year: ${response.data.Year}
        IMDB Rating: ${response.data.imdbRating}
        Rotten Tomatoes Rating: ${ratings}
        Country: ${response.data.Country}
        Language: ${response.data.Language}
        Plot: ${response.data.Plot}
        Actors: ${response.data.Actors}
      `
      fs.appendFile("./log.txt", movie, function(err) {
        if (err)
          return console.error(err);
        console.log(movie);
      });
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
  fs.readFile("./random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }
    var dataArr = data.split(",");
    spotifyThis(dataArr[1]);
  });
}
