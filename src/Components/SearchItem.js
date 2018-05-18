import React, { Component } from 'react';


export class SearchItem extends Component {
    constructor(props){
        super(props);
        this.handleSongClick = this.handleSongClick.bind(this);
    
    }

    handleSongClick(){
        this.props.addSong(this.props.song);

    }

    componentDidMount(){


    }

    render() {
        return(
            <div onClick={this.handleSongClick} className="searchItem">
                <div>+</div>

                <div className="songInfo"><strong>{this.props.song.title} by {this.props.song.artist} ({this.props.song.bpm} BPM)</strong></div>

            </div>
        );
    }
}