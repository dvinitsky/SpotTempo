import React, { Component } from "react";

class Song extends Component {
  constructor(props) {
    super(props);
    this.handleSongClick = this.handleSongClick.bind(this);
  }

  handleSongClick() {
    this.props.shiftSong(this.props.song);
  }

  render() {
    return (
      <div
        onClick={this.handleSongClick}
        className={
          this.props.list === "searchResults" ? "searchItem" : "playlistItem"
        }
      >
        <div>{this.props.list === "searchResults" ? "+" : "-"}</div>

        <div className="songInfo">
          <strong>
            {this.props.song.name} by {this.props.song.artist} ({this.props.song.tempo}{" "}
            BPM)
          </strong>
        </div>
      </div>
    );
  }
}

export default Song;
