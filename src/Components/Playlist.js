import React, { Component } from 'react';
import {PlaylistItem} from './PlaylistItem';

export class Playlist extends Component {

  render(){
    return(
      <div className="playlist">

        {this.props.playlist.map(result => {
          return <PlaylistItem key={result.id} song={result} removeSong = {this.props.removeSong}/>
          })}

      </div>
        )
    }
}