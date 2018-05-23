let userId = '';
let playlistId = '';

const clientId = '200fe6a2e65643b4bada24a59cebc2cb';
//const clientSecret = 'c5082a4127ae4ae7b61dd87abe544784';
const redirectUri = 'http://localhost:3000/';
let accessToken;

let getRequestURL = 'https://accounts.spotify.com/authorize?client_id=' + clientId + '&response_type=token&redirect_uri=' + redirectUri + '&scope=playlist-read-private%20playlist-modify-private&state=' + randomState(10);


export async function SpotifyHandler(){
  function getAccessToken(){
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
    }
    else{
      window.location =  getRequestURL;
    }
  }

  function getPlaylist(){
    const headers = {
      'Authorization':  'Bearer ' + accessToken,
    };

    fetch('https://api.spotify.com/v1/me', {headers: headers}).then(response => {
      if(response.ok){
        return response.json();
      } throw new Error('Request failed!');
    }, networkError => console.log(networkError.message)).then(jsonResponse => {
      return jsonResponse.id;
    }).then(id => {
      userId = id;
      return 'https://api.spotify.com/v1/me/playlists';
    }).then(urlString => {
      fetch(urlString, {headers: headers}).then(response => {
        if(response.ok){
          return response.json();
        } throw new Error('Request Failed.');
      }, networkError => console.log(networkError.message)).then(jsonResponse => {
        let playlistExists = false;          
        jsonResponse.items.forEach(playlist => {
          if(playlist.name === 'SpotifyBPM'){
            console.log(playlist.name);
            playlistId = playlist.id;
            playlistExists = true;
          }});
          if(!playlistExists){
            //create one!
            fetch('https://api.spotify.com/v1/' + userId + '/playlists', {
              headers: headers,
              method: 'POST',
              body: {
                "name": "SpotifyBPM",
                "public": "false"
              }
          }).then(response => {
            if(response.ok){
              console.log(response);
              return response;
            } throw new Error('Request Failed!');
          }, networkError => console.log(networkError.message)).then(jsonResponse => {
            console.log(jsonResponse);
          });

          }
        });
      });    
  }

  await getAccessToken();
  await getPlaylist();

}



function randomState (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
  
