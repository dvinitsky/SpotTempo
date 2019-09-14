import React from "react";
import Song from "./Song";

export const SongList = ({ shiftSong, listName, songs }) => (
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
);

export default SongList;
