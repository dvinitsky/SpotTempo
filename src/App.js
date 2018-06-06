import React, { Component } from "react";
import "./App.css";
import { SongList } from "./Components/SongList";
import { SpotifyHandler } from "./Components/SpotifyHandler";

class App extends Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.addSong = this.addSong.bind(this);
    this.removeSong = this.removeSong.bind(this);

    this.state = {
      origin: [],
      originId: "",
      destination: [],
      destinationId: "",
      searchResults: []
    };
  }

  async handleLogin() {
    await SpotifyHandler.setAccessToken();

    let userId = await SpotifyHandler.getUserId();
    this.setState({ userId: userId });

    let userPlaylists;
    while (this.state.originId === "") {
      userPlaylists = await SpotifyHandler.getUserPlaylists();

      let playlistId = SpotifyHandler.setOriginId(userPlaylists);
      this.setState({ originId: playlistId });

      //make sure there's a SpotTempo playlist
      if (this.state.originId === "") {
        alert('Please create a playlist named "SpotTempo"');
      }
    }

    let destinationId;
    let playlistExists = false;
    for (let i = 0; i < userPlaylists.items.length; i++) {
      if (userPlaylists.items[i].name === "SpotTempo Workout") {
        destinationId = userPlaylists.items[i].id;
        playlistExists = true;
        break;
      }
    }
    if (!playlistExists) {
      destinationId = await SpotifyHandler.createPlaylist(userId);
    }

    //fetch BPM information
    let bpmList = await SpotifyHandler.getPlaylistTracks(
      this.state.userId,
      this.state.originId
    );

    bpmList = bpmList.map(song => {
      return song.track;
    });

    let ids = "";

    for (let i = 0; i < bpmList.length; i++) {
      ids += bpmList[i].id;
      if (i !== bpmList.length - 1) {
        ids += ",";
      }
    }

    /////returns an array of audio feature obects
    if (ids.length !== 0) {
      let audioFeatures = await SpotifyHandler.getTempo(ids);

      for (let i = 0; i < audioFeatures.audio_features.length; i++) {
        bpmList[i].tempo = audioFeatures.audio_features[i].tempo.toFixed(1);
      }
    }

    //get existing SpotTempo Workout songs
    let destination = await SpotifyHandler.getPlaylistTracks(
      this.state.userId,
      destinationId
    );
    destination = destination.map(song => {
      return song.track;
    });
    console.log(destination);

    this.setState({
      origin: bpmList,
      searchResults: bpmList,
      destinationId: destinationId,
      destination: destination
    });
  }

  async handleSearch(e) {
    let matchingSongs = [];

    if (e.target.value === "") {
      matchingSongs = this.state.origin;
    } else {
      let searchbpm = parseInt(e.target.value, 10);
      for (let i = 0; i < this.state.origin.length; i++) {
        let currentSong = this.state.origin[i];

        if (
          currentSong.tempo > searchbpm - 10 &&
          currentSong.tempo < searchbpm + 10
        ) {
          matchingSongs.push(currentSong);
        }
      }
    }

    this.setState({ searchResults: matchingSongs });
  }

  async addSong(song) {
    this.state.destination.push(song);

    function removeFromOtherList(list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === song.id) {
          list.splice(i, 1);
        }
      }
      return list;
    }

    this.setState({
      origin: removeFromOtherList(this.state.origin, song),
      searchResults: removeFromOtherList(this.state.searchResults, song)
    });

    await SpotifyHandler.addTrack(
      this.state.userId,
      this.state.destinationId,
      song.uri
    );
  }

  removeSong(song) {
    let bpm = parseInt(
      document.getElementsByClassName("searchBar")[0].value,
      10
    );
    if (song.tempo > bpm - 10 && song.tempo < bpm + 10) {
      this.state.searchResults.push(song);
    }
    this.state.destination.splice(this.state.destination.indexOf(song), 1);
    this.state.origin.push(song);
    this.setState({});
  }

  render() {
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
          onChange={this.handleSearch}
        />

        <div className="searchResultsContainer">
          <div className="searchResultsHeader">Search Results</div>
          <SongList
            songs={this.state.searchResults}
            shiftSong={this.addSong}
            list="searchResults"
          />
        </div>

        <div className="playlistContainer">
          <div className="playlistHeader">Playlist</div>
          <SongList
            songs={this.state.destination}
            shiftSong={this.removeSong}
            list="playlist"
          />
        </div>

        <LoginArea
          onclick={this.handleLogin}
          userId={this.state.userId}
          originId={this.state.originId}
        />
      </div>
    );
  }
}
export default App;

//stateless component
const LoginArea = props => {
  return (
    <div>
      <button onClick={props.onclick} className="spotifyLogin">
        Click here to log in with Spotify
      </button>
      <div>User ID: {props.userId}</div>
      <div>Playlist ID: {props.originId}</div>
    </div>
  );
};
