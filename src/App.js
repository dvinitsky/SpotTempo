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
      BPMplaylist: [],
      searchResults: [],
      playlist: []
    };
  }

  async handleLogin() {
    await SpotifyHandler.setAccessToken();

    let userId = await SpotifyHandler.getUserId();
    this.setState({ userId: userId });

    let userPlaylists = await SpotifyHandler.getUserPlaylists();

    let playlistId = SpotifyHandler.setSpotifyBPMPlaylistId(userPlaylists);
    this.setState({ spotifyBPMPlaylistId: playlistId });

    if (this.state.spotifyBPMPlaylistId === "") {
      await SpotifyHandler.createPlaylist(userId);
    }

    let BPMplaylist = await SpotifyHandler.getBPMTracks(
      this.state.userId,
      this.state.spotifyBPMPlaylistId
    );

    BPMplaylist = BPMplaylist.map(song => {
      return song.track;
    });

    let ids = "";

    for (let i = 0; i < BPMplaylist.length; i++) {
      ids += BPMplaylist[i].id;
      if (i !== BPMplaylist.length - 1) {
        ids += ",";
      }
    }

    /////returns an array of audio feature obects
    let audioFeatures = await SpotifyHandler.getTempo(ids);

    for (let i = 0; i < audioFeatures.audio_features.length; i++) {
      BPMplaylist[i].tempo = audioFeatures.audio_features[i].tempo.toFixed(1);
    }

    this.setState({ BPMplaylist: BPMplaylist, searchResults: BPMplaylist });
  }

  async handleSearch(e) {
    let matchingSongs = [];

    if(e.target.value === ''){
      matchingSongs = this.state.BPMplaylist;
    } else{
      let searchbpm = parseInt(e.target.value, 10);
      for (let i = 0; i < this.state.BPMplaylist.length; i++) {
        let currentSong = this.state.BPMplaylist[i];

        if (currentSong.tempo > searchbpm - 10 && currentSong.tempo < searchbpm + 10) {
          matchingSongs.push(currentSong);
        }
      }
    }

    this.setState({ searchResults: matchingSongs });
  }

  addSong(song) {
    this.state.playlist.push(song);

    function removeFromOtherList(list){
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === song.id) {
          list.splice(i, 1);
        }
      }
      return list;
    }

    this.setState({ BPMplaylist: removeFromOtherList(this.state.BPMplaylist, song), searchResults: removeFromOtherList(this.state.searchResults, song) });
  }

  removeSong(song) {
    let bpm = parseInt(
      document.getElementsByClassName("searchBar")[0].value,
      10
    );
    if (song.tempo > bpm - 10 && song.tempo < bpm + 10) {
      this.state.searchResults.push(song);
    }
    this.state.playlist.splice(this.state.playlist.indexOf(song), 1);
    this.state.BPMplaylist.push(song);
    this.setState({});
  }


  render() {
    return (
      <div className="App">
        <h1 className="title headerGroup">Spotify BPM Picker</h1>
        <div className="headerGroup headerText">
          This app will allow you to search for songs by BPM in your
          "SpotifyBPM" playlist, and add them to your "BPMWorkout" playlist.
        </div>

        <input
          id= "searchbar"
          type= "text"
          className="searchBar headerGroup"
          placeholder="Search by BPM"
          onFocus= {() => {document.getElementById('searchbar').placeholder = ''}}
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
            songs={this.state.playlist}
            shiftSong={this.removeSong}
            list="playlist"
          />
        </div>

        <LoginArea
          onclick={this.handleLogin}
          userId={this.state.userId}
          spotifyBPMPlaylistId={this.state.spotifyBPMPlaylistId}
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
      <div>Playlist ID: {props.spotifyBPMPlaylistId}</div>
    </div>
  );
};
