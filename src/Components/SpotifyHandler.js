const clientId = '200fe6a2e65643b4bada24a59cebc2cb';
//const clientSecret = 'c5082a4127ae4ae7b61dd87abe544784';
const redirectUri = 'http://localhost:3000/';
let accessToken;

let getRequestURL = 'https://accounts.spotify.com/authorize?client_id=' + clientId + '&response_type=token&redirect_uri=' + redirectUri + '&scope=playlist-read-private%20playlist-modify-private%20playlist-modify-public&state=' + randomState(10);

export const SpotifyHandler = {

  getAccessToken: async function(){
    console.log('starting getAccessToken');
    if(typeof accessToken !== 'undefined'){
      console.log('ending getAccessToken (1)');
      return accessToken;
    }
    else if (      
      (window.location.href.match(/access_token=([^&]*)/) !== null) && (window.location.href.match(/expires_in=([^&]*)/) !== null)) {
      accessToken = window.location.href.split('access_token=')[1].split('&token_type')[0];

      let expirationTime = 3600;

      //from Jammin instructions
      window.setTimeout(() => accessToken = '', expirationTime * 1000);
      window.history.pushState('Access Token', null, '/');
      console.log('ending getAccessToken (2)');

    }
    else{
      window.location =  getRequestURL;
      console.log('ending getAccessToken (3)');

    }
  },

  getUserId: async function(){
    console.log('starting getUserId');

    try{
      let response = await fetch('https://api.spotify.com/v1/me', 
        {headers: {'Authorization':  'Bearer ' + accessToken}});   
      
      if(response.ok){
          let user = await response.json();
          console.log('ending getUserId (1)');

          return user.id;
        } throw new Error('Request failed!');
    } catch (error) {
      console.log(error);
    }
    console.log('ending getUserId (2)');
  },

  getUserPlaylists: async function (){
    console.log('starting getUserPlaylists');

    try{
      let response = await fetch('https://api.spotify.com/v1/me/playlists',
        {headers: {'Authorization':  'Bearer ' + accessToken}});

      if(response.ok){
        let playlists = response.json();
        console.log('ending getUserPlaylists (1)');
        return playlists;
      } throw new Error('Request failed!');
    } catch (error) {
      console.log(error);
    }
    console.log('ending getUserPlaylists (2)');

  },

  getSpotifyBPMPlaylistId: async function(playlists, userId) {
    console.log('starting getSpotifyBPMPlaylistId');

    //check if the playlist already exists
    playlists.items.forEach(playlist => {
      if(playlist.name === 'SpotifyBPM'){
        console.log('playlist found: ' + playlist.name);
        return playlist.id;
    }});
    
    
    //if we're still in the function, we need to create a playlist named Spotify BPM
    try{
      console.log('Auyth: ' + 'Authorization:  Bearer ' + accessToken);
      let response = await fetch('https://api.spotify.com/v1/' + userId + '/playlists', {
        headers: {'Authorization':  'Bearer ' + accessToken,
                  'Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify({
          name: "SpotifyBPM"
        })
      });

      if(response.ok){
        let xx = response.json();
        console.log('xzxxxxxx');
        console.log(xx);
        console.log('ending getSpotifyBPMPlaylistId (1)');

        return xx;
      } throw new Error('Request failed!');
    } catch (error) {
      console.log(error);
    }
    
    console.log('ending getSpotifyBPMPlaylistId (2)');

  }
}



function randomState (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
  
