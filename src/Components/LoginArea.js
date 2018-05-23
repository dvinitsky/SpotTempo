import React, { Component } from 'react';
import {SpotifyHandler} from './SpotifyHandler';

export class LoginArea extends Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      userId: '',
      playlistId: ''
    }
  }

  async handleClick(e){
    await SpotifyHandler.setAccessToken();

    let userId = await SpotifyHandler.getUserId();
    this.setState({userId: userId});
    let userPlaylists = await SpotifyHandler.getUserPlaylists();

    let playlistId = SpotifyHandler.getSpotifyBPMPlaylistId(userPlaylists);
    this.setState({playlistId: playlistId});

    if(playlistId === ''){
      playlistId = await SpotifyHandler.createPlaylist(this.state.userId);
    }

    this.setState({playlistId: playlistId});


  }

  render(){
    return(
      <div>
        <button onClick={this.handleClick} className='spotifyLogin'>Click here to log in with Spotify</button>
        <div>User ID: {this.state.userId}</div>
        <div>Playlist ID: {this.state.playlistId}</div>
      </div>
    );
  }


}

export default LoginArea;