const fs = require('fs');
const https = require('https');
const express = require('express'),
  app = express(),
  path = require('path');

  
const clientId = '200fe6a2e65643b4bada24a59cebc2cb';
const clientSecret = 'c5082a4127ae4ae7b61dd87abe544784';
const redirectUri = 'http://localhost:3000/';


app.set('port', process.env.PORT || 5000);       //set port variable

//allows front-end to request clientId and clientSecret

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


app.get('/login', (req, res) => {
  console.log('About to contact Spotify');
  let url = 'https://accounts.spotify.com/authorize?client_id=' + clientId + '&response_type=code&redirect_uri=http://localhost:3000/&scope=playlist-read-private%20playlist-modify-private&state=1777263456';

  res.redirect(url);
  
  




  //res.status(200).send(result);
  /*
  const newRequest = https.get(url, (response) => {
    let data = '';
    response.on('data', (chunk) =>{
      data += chunk;
    });

    response.on('end', () => {
      console.log('DATA: ' + data);
      console.log('Done reading.');
      return data;
      //res.status(200).send(response);
    });

  });

  newRequest.on('error', (err) => {
    console.log('oo');
  });
*/
});


app.listen(app.get('port'), function(){
  console.log('Listening on port ' + app.get('port'));
});

////////////////////////////////////////////////


//const loginPostRequestURL = 'https://accounts.spotify.com/api/token';
