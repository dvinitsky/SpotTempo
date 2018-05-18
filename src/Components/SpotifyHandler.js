const playlistURL = 'https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/tracks';
const clientId = '200fe6a2e65643b4bada24a59cebc2cb';

//MOVE THE SECRET KEY TO A SECURE LOCATION, LIKE A BACKEND SERVICE (NODE.JS)
const clientSecret = 'c5082a4127ae4ae7b61dd87abe544784';

const redirectUri = 'https://www.google.com';

let randomState = length => {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  console.log(text);
  return text;
};

const loginGetRequestURL = 'https://accounts.spotify.com/authorize/?client_id=' + clientId + "&response_type=code&redirect_uri=" + redirectUri; //+ "&scope=playlist-read-private%20playlist-modify-private&state=" + randomState;

const loginPostRequestURL = 'https://accounts.spotify.com/api/token';

let myHeaders = new Headers({
  'Access-Control-Allow-Origin': true
});

let myObj = {
  method: 'GET',
  mode: 'cors',
  headers: myHeaders
}

let myRequest = new Request(loginGetRequestURL, myObj);

 export function loginUser(){
   console.log('I\'m in loginUser!');
    fetch(myRequest).then(response => {
      if(response.ok){
        console.log('get request is okay!');
        return response.json();
      }
      throw new Error('Request failed!');
      }, networkError => console.log(networkError.message)
      ).then(jsonResponse => {
        console.log('auth code: ' + jsonResponse);
        fetch(loginPostRequestURL, {
          method: 'POST',
          body: JSON.stringify({id: '200'}),
          grant_type: 'authorization_code',
          code: jsonResponse.code,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret: clientSecret
        }).then(response => {                  
          if(response.ok) {
            return response.json();                                                
          }                                                                          
          throw new Error('Request failed!');
        }, networkError => console.log(networkError.message)
        ).then(jsonResponse => {
          console.log('made it!');
        });
        
      });

  }

  
  export function getUserPlaylist(){
    fetch(playlistURL).then(response => {
      if(response.ok){
        return response.json();
      }
      throw new Error('Request failed!');
      }, networkError => console.log(networkError.message)
      ).then(jsonResponse => {
        //do something with repsonse
    });


  }



