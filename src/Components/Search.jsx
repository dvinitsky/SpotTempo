import React, { useState, useEffect } from "react";
import { SongList } from "./SongList";
import styled from "styled-components";
import { SpotifyService } from "../services/SpotifyService";
import { getMatchingTracks } from "../helpers/helpers";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Title = styled.div`
  font-size: 25px;
`;
const HeaderText = styled.div`
  text-align: center;
  color: white;
  margin: 20px 60px;
`;
const SearchBar = styled.input`
  font-size: 24px;
  margin-right: 20px;
`;
const SearchArea = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
`;
const ListsContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Search = ({ accessToken }) => {
  const [originPlaylistTracks, setOriginPlaylistTracks] = useState([]);
  const [destinationPlaylistTracks, setDestinationPlaylistTracks] = useState(
    []
  );
  const [searchResults, setSearchResults] = useState([]);
  const [Spotify, setSpotify] = useState();
  const [bpm, setBpm] = useState();

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

  const handleSearch = () => {
    const newBpm = document.getElementById("searchbar").value;
    setBpm(newBpm);
    setSearchResults(getMatchingTracks(newBpm, originPlaylistTracks));
  };

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

    const bpm = document.getElementById("searchbar").value;
    if (song.tempo > bpm - 10 && song.tempo < bpm + 10) {
      setSearchResults([...searchResults, song]);
    }
  };

  return (
    <Wrapper>
      <Title>Spotify BPM Picker</Title>
      <HeaderText>
        This app will allow you to search for songs by BPM in your "SpotTempo"
        playlist, and add them to your "SpotTempo Workout" playlist.
      </HeaderText>

      <SearchArea>
        <SearchBar id="searchbar" type="text" />
        <button onClick={handleSearch}>Search</button>
      </SearchArea>

      <ListsContainer>
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
      </ListsContainer>
    </Wrapper>
  );
};
export default Search;
