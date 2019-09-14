import React, { useState } from "react";
import "./App.css";
import { SongList } from "./SongList";
import { addTrack } from "../helpers/spotify";
import { LoginArea } from "./Login";
import { login } from "../helpers/login-helpers";
import { getMatchingTracks } from "../helpers/search-helpers";

const App = () => {
  const [userId, setUserId] = useState("");
  const [originPlaylistId, setOriginPlaylistId] = useState("");
  const [originPlaylistTracks, setOriginPlaylistTracks] = useState([]);
  const [destinationPlaylistId, setDestinationPlaylistId] = useState("");
  const [destinationPlaylistTracks, setDestinationPlaylistTracks] = useState(
    []
  );
  const [searchResults, setSearchResults] = useState([]);

  const handleLogin = async () => {
    const {
      userId,
      originPlaylistId,
      originPlaylistTracks,
      destinationPlaylistId,
      destinationPlaylistTracks
    } = await login();

    setUserId(userId);
    setOriginPlaylistId(originPlaylistId);
    setOriginPlaylistTracks(originPlaylistTracks);
    setDestinationPlaylistId(destinationPlaylistId);
    setDestinationPlaylistTracks(destinationPlaylistTracks);
  };

  const handleSearch = async e =>
    setSearchResults(await getMatchingTracks(e.target.value));

  const addSongToDestination = async song => {
    setDestinationPlaylistTracks([...destinationPlaylistTracks, song]);
    setOriginPlaylistTracks([
      originPlaylistTracks.filter(item => item.id !== song.id)
    ]);
    setSearchResults([searchResults.filter(item => item.id !== song.id)]);

    await addTrack(userId, destinationPlaylistId, song.uri);
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
    <div className="App">
      <h1 className="title headerGroup">Spotify BPM Picker</h1>
      <div className="headerGroup headerText">
        This app will allow you to search for songs by BPM in your "SpotTempo"
        playlist, and add them to your "SpotTempo Workout" playlist.
      </div>

      <input
        id="searchbar"
        type="text"
        className="searchBar headerGroup"
        placeholder="Search by BPM"
        onFocus={() => {
          document.getElementById("searchbar").placeholder = "";
        }}
        onChange={handleSearch}
      />

      <div className="searchResultsContainer">
        <div className="searchResultsHeader">Search Results</div>
        <SongList
          songs={searchResults}
          shiftSong={addSongToDestination}
          list="searchResults"
        />
      </div>

      <div className="playlistContainer">
        <div className="playlistHeader">Playlist</div>
        <SongList
          songs={destinationPlaylistTracks}
          shiftSong={removeSongFromDestination}
          list="playlist"
        />
      </div>

      <LoginArea
        onclick={handleLogin}
        userId={userId}
        originId={originPlaylistId}
      />
    </div>
  );
};
export default App;
