import React from "react";
import Song from "./Song";

export const SongList = ({ label, shiftSong, listName, songs }) => (
  <div
    className={`${
      label === "Playlist" ? "playlist" : "searchResults"
    }Container`}
  >
    <div
      className={`${label === "Playlist" ? "playlist" : "searchResults"}Header`}
    >
      Search Results
    </div>
    <div className={listName}>
      {songs.map(song => (
        <Song
          key={song.id}
          song={song}
          shiftSong={shiftSong}
          listName={listName}
        />
      ))}
    </div>
  </div>
);

export default SongList;
