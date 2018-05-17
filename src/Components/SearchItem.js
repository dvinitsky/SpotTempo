import React, { Component } from 'react';


export class SearchItem extends Component {
    constructor(props){
        super(props);
        this.handleSongClick = this.handleSongClick.bind(this);
    
    }

    handleSongClick(){
        this.props.addSong(this.props.song);

    }

    render() {
        return(
            <div onClick={this.handleSongClick} className="searchItem">
                <div>+</div>

                <div className="songInfo">{this.props.song.title} by {this.props.song.artist} ({this.props.song.bpm} BPM)</div>

            </div>
        );
    }
}