import React, { Component } from 'react';
import {loginUser} from './SpotifyHandler';

export class LoginArea extends Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e){
    loginUser();
  }

  render(){
    return(
      <button onClick={this.handleClick} className='spotifyLogin'>Click here to log in with Spotify</button>
    );
  }


}

export default LoginArea;