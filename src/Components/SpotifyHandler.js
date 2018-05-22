const playlistURL = 'https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/tracks';
function randomState (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  console.log(text);
  return text;
}
//&state=" + randomState(10)

////////////////////////////////////

export function loginUser(){
  async function getCodes(){
    try{
      let response = await fetch('http://localhost:8888/login');
      if (response.ok) {
        let textResponse = await response.text();
        return textResponse;
      } throw new Error('Request Failed.');
    } catch (error) {
      console.log(error);
    }
  }
  getCodes();

    /*.then(jsonResponse => {
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
    */
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



