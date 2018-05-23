import React, { Component } from 'react';
import {SpotifyHandler} from './SpotifyHandler';

export class LoginArea extends Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e){
    SpotifyHandler();

    /*
    await getAccessToken();
    let userId = await getUserId();
    let userPlaylists = await getUserPlaylists();
    await getSpotifyBPMPlaylistId(userPlaylists, userId);
    */
  }

  render(){
    return(
      <button onClick={this.handleClick} className='spotifyLogin'>Click here to log in with Spotify</button>
    );
  }


}

export default LoginArea;