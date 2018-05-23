const clientId = '200fe6a2e65643b4bada24a59cebc2cb';
//const clientSecret = 'c5082a4127ae4ae7b61dd87abe544784';
const redirectUri = 'http://localhost:3000/';

let getRequestURL = 'https://accounts.spotify.com/authorize?client_id=' + clientId + '&response_type=token&redirect_uri=' + redirectUri + '&scope=playlist-read-private%20playlist-modify-private%20playlist-modify-public';//&state=' + randomState(10);


let accessToken;

export const SpotifyHandler = {
  setAccessToken: async function(){
    if(typeof accessToken !== 'undefined'){
      return accessToken;
    }
    else if (      
      (window.location.href.match(/access_token=([^&]*)/) !== null) && (window.location.href.match(/expires_in=([^&]*)/) !== null)) {
      accessToken = window.location.href.split('access_token=')[1].split('&token_type')[0];

      let expirationTime = 3600;

      //from Jammin instructions
      window.setTimeout(() => accessToken = '', expirationTime * 1000);
      window.history.pushState('Access Token', null, '/');
      //
    }
    else{
      window.location =  getRequestURL;
    }
  },

  getUserId: async function(){
    try{
      let response = await fetch('https://api.spotify.com/v1/me', 
        {headers: {'Authorization':  'Bearer ' + accessToken}});   
      if(response.ok){
          let user = await response.json();
          return user.id;
        } throw new Error('Request failed!');
    } catch (error) {
      console.log(error);
    }
  },

  getUserPlaylists: async function (){
    try{
      let response = await fetch('https://api.spotify.com/v1/me/playlists',
        {headers: {'Authorization':  'Bearer ' + accessToken}});
      if(response.ok){
        return await response.json();
      } throw new Error('Request failed!');
    } catch (error) {
      console.log(error);
    }
  },

  setSpotifyBPMPlaylistId: function(userPlaylists) {
    let id = '';
    //check if the playlist already exists
    userPlaylists.items.forEach(playlist => {
      if(playlist.name === 'SpotifyBPM'){
        id = playlist.id;
    }});
    return id;
  },
    
  createPlaylist: async function(userId){
    //if we're still in the function, we need to create a playlist named Spotify BPM
    try{
      let response = await fetch('https://api.spotify.com/v1/users/' + userId + '/playlists', {
        headers: {'Authorization':  'Bearer ' + accessToken,
                  'Content-Type': 'application/json'
                 },
        method: 'POST',
        body: JSON.stringify({
          "name": "SpotifyBPM"
        })
      });

      if(response.ok){
        let playlist = await response.json();
        return playlist.id;
      } throw new Error('Request failed!');
    } catch (error) {
      console.log(error);
    }
  },

  getBPMTracks: async function(userId, spotifyBPMPlaylistId){
    try{
      let response = await fetch('https://api.spotify.com/v1/users/' + userId +'/playlists/' + spotifyBPMPlaylistId + '/tracks',
        {headers: {'Authorization':  'Bearer ' + accessToken}});
      if(response.ok){
        let playlist = await response.json();
        return playlist.items;
      } throw new Error('Request failed!');
    } catch (error) {
      console.log(error);
    }
  },

  getTempo: async function(trackId){
    try{
      let response = await fetch('https://api.spotify.com/v1/audio-features/' + trackId,
        {headers: {'Authorization':  'Bearer ' + accessToken}});
      if(response.ok){
        let songAudioInfo = await response.json();
        return songAudioInfo.tempo;
      } throw new Error('Request Failed!');
    } catch (error) {
      console.log(error);
    }
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
  
