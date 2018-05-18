import React, { Component } from 'react';


export class PlaylistItem extends Component {
    constructor(props){
        super(props);
        this.handleSongClick = this.handleSongClick.bind(this);
    
    }

    handleSongClick(){
        this.props.removeSong(this.props.song);

    }

    render() {
        return(
            <div onClick={this.handleSongClick} className="playlistItem">
                <div>-</div>

                <div className="songInfo"><strong>{this.props.song.title} by {this.props.song.artist} ({this.props.song.bpm} BPM)</strong></div>

            </div>
        );
    }
}