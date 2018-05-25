import React, { Component } from "react";
import Song from "./Song";

export class SongList extends Component {
  render() {
    return (
      <div
        className={
          this.props.list === "searchResults" ? "searchResults" : "playlist"
        }
      >
        {this.props.songs.map(song => {
          return (
            <Song
              key={song.id}
              song={song}
              shiftSong={this.props.shiftSong}
              list={this.props.list}
            />
          );
        })}
      </div>
    );
  }
}

export default SongList;
