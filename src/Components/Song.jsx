import React from "react";
import styled from "styled-components";

const songElementPadding = "10px";

const SongItem = styled.div`
  margin: 20px;
  text-align: center;
  border-radius: 20px;
  background-color: ${props =>
    props.listName === "searchResults" ? "#f0eeb7" : "#c8e2ee"};
`;
const AddRemove = styled.div`
  padding: ${songElementPadding};
  font-size: 25px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const SongInfo = styled.div`
  border-left: 1px solid rgb(172, 182, 173);
  border-right: 1px solid rgb(172, 182, 173);
  padding: ${songElementPadding};
  font-weight: 600;
`;
const Bpm = styled.div`
  padding: ${songElementPadding};
`;

export const Song = ({ listName, shiftSong, song }) => (
  <SongItem onClick={() => shiftSong(song)}>
    <AddRemove>{listName === "searchResults" ? "+" : "-"}</AddRemove>

    <SongInfo>
      {song.name} by {song.album.artists[0].name}
    </SongInfo>
    <Bpm>{song.tempo} BPM</Bpm>
  </SongItem>
);

export default Song;
