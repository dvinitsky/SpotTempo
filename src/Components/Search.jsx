import React, { useState, useEffect } from "react";
import { SongList } from "./SongList";
import styled from "styled-components";
import { SpotifyService } from "../services/SpotifyService";
import { getMatchingTracks } from "../helpers/helpers";

const Title = styled.h1`
  text-align: center;
`;
const HeaderText = styled.div`
  text-align: center;
  color: white;
`;
const SearchBar = styled.input`
  margin: 0 30px;
  font-size: 24px;
`;

const Search = ({ accessToken }) => {
  const [originPlaylistTracks, setOriginPlaylistTracks] = useState([]);
  const [destinationPlaylistTracks, setDestinationPlaylistTracks] = useState(
    []
  );
  const [searchResults, setSearchResults] = useState([]);
  const [Spotify, setSpotify] = useState();

  useEffect(() => {
    const Spotify = new SpotifyService(accessToken);

    (async () => {
      const allData = await Spotify.getAllData();

      setOriginPlaylistTracks(allData.originPlaylistTracks);
      setDestinationPlaylistTracks(allData.destinationPlaylistTracks);
      setSearchResults(allData.originPlaylistTracks);
    })();

    setSpotify(Spotify);
  }, [accessToken, setSpotify]);

  const handleSearch = async e =>
    setSearchResults(
      await getMatchingTracks(e.target.value, originPlaylistTracks)
    );

  const addSongToDestination = async song => {
    setDestinationPlaylistTracks([...destinationPlaylistTracks, song]);
    setOriginPlaylistTracks(
      originPlaylistTracks.filter(item => item.id !== song.id)
    );
    setSearchResults(searchResults.filter(item => item.id !== song.id));

    await Spotify.addTrack(song.uri);
  };

  const removeSongFromDestination = song => {
    setOriginPlaylistTracks([...originPlaylistTracks, song]);
    setDestinationPlaylistTracks(
      destinationPlaylistTracks.filter(track => track.id !== song.id)
    );

    const bpm = document.getElementsByClassName("searchBar")[0].value;
    if (song.tempo > bpm - 10 && song.tempo < bpm + 10) {
      setSearchResults([...searchResults, song]);
    }
  };

  return (
    <>
      <Title>Spotify BPM Picker</Title>
      <HeaderText>
        This app will allow you to search for songs by BPM in your "SpotTempo"
        playlist, and add them to your "SpotTempo Workout" playlist.
      </HeaderText>

      <SearchBar id="searchbar" type="text" />
      <button onClick={handleSearch}>Search</button>

      <SongList
        label="Search Results"
        songs={searchResults}
        shiftSong={addSongToDestination}
        listName="searchResults"
      />

      <SongList
        label="Playlist"
        songs={destinationPlaylistTracks}
        shiftSong={removeSongFromDestination}
        listName="playlist"
      />
    </>
  );
};
export default Search;
