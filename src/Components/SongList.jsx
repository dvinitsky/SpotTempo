import React from "react";
import Song from "./Song";
import styled from "styled-components";

const Header = styled.div`
  text-align: center;
  font-size: 20px;
`;

export const SongList = ({ label, shiftSong, listName, songs }) => (
  <div>
    <Header>{label}</Header>
    {songs.map((song, index) => (
      <Song key={index} song={song} shiftSong={shiftSong} listName={listName} />
    ))}
  </div>
);

export default SongList;
