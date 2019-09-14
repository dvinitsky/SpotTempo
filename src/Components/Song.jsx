import React from "react";

export const Song = ({ listName, shiftSong, song }) => (
  <div onClick={() => shiftSong(song)} className={`song ${listName}`}>
    <div className="add-remove">
      <div>{listName === "searchResults" ? "+" : "-"}</div>
    </div>

    <div className="songInfo">
      <strong>
        {song.name} by {song.album.artists[0].name}
      </strong>
    </div>
    <div className="bpm">{song.tempo} BPM</div>
  </div>
);

export default Song;
