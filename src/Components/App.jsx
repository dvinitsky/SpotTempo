import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./Login";
import { SongList } from "./SongList";
import {
  getAccessTokenAndExpirationSeconds,
  getMatchingTracks
} from "../helpers/helpers";
import { redirectUri, clientId } from "../constants/constants";
import { SpotifyService } from "../services/SpotifyService";

const App = () => {
  const [accessToken, setAccessToken] = useState();
  const [originPlaylistTracks, setOriginPlaylistTracks] = useState([]);
  const [destinationPlaylistTracks, setDestinationPlaylistTracks] = useState(
    []
  );
  const [searchResults, setSearchResults] = useState([]);
  const [Spotify, setSpotify] = useState();

  useEffect(() => {
    const {
      accessToken: at = "",
      expirationSeconds = 0
    } = getAccessTokenAndExpirationSeconds();

    if (at) {
      setAccessToken(at);
      const Spotify = new SpotifyService(at);

      (async () => {
        const allData = await Spotify.getAllData();

        setOriginPlaylistTracks(allData.originPlaylistTracks);
        setDestinationPlaylistTracks(allData.destinationPlaylistTracks);
        setSearchResults(allData.originPlaylistTracks);
      })();

      setSpotify(Spotify);
      window.setTimeout(() => setAccessToken(), expirationSeconds * 1000);
    }
  }, [setAccessToken]);

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

  const handleLogin = () => {
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=playlist-read-private%20playlist-modify-private%20playlist-modify-public`;
  };

  return accessToken ? (
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
    </div>
  ) : (
    <Login onclick={handleLogin} />
  );
};
export default App;
