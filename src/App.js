import React, { Component } from 'react';
import './App.css';
import {SearchResults} from './Components/SearchResults';
import {Playlist} from './Components/Playlist';
import { SpotifyHandler } from './Components/SpotifyHandler';

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
    }
  }

  async handleLogin(){
    await SpotifyHandler.setAccessToken();

    let userId = await SpotifyHandler.getUserId();
    this.setState({userId: userId});

    let userPlaylists = await SpotifyHandler.getUserPlaylists();

    let playlistId = SpotifyHandler.setSpotifyBPMPlaylistId(userPlaylists);
    this.setState({spotifyBPMPlaylistId: playlistId});

    if(this.state.spotifyBPMPlaylistId === ''){
      await SpotifyHandler.createPlaylist(userId);
    }

    let BPMplaylist = await SpotifyHandler.getBPMTracks(this.state.userId, this.state.spotifyBPMPlaylistId);
    this.setState({BPMplaylist: BPMplaylist})
    console.log(this.state.BPMplaylist);
  }

  async handleSearch(e){
    let searchbpm = parseInt(e.target.value, 10);
    let matchingSongs = [];

    for(let i = 0; i < this.state.BPMplaylist.length; i++){
      let currentSong = this.state.BPMplaylist[i].track;
      let songTempo = await SpotifyHandler.getTempo(currentSong.id);
      console.log('Tempo for ' + currentSong.name + ' is ' + songTempo);


      if(songTempo > searchbpm - 10 && songTempo < searchbpm + 10){
        matchingSongs.push(currentSong);
      }
    }
    /*
    let matchingSongs = await this.state.BPMplaylist.filter(song => {
      let songTempo = SpotifyHandler.getTempo(song.track.id);
      console.log('Tempo for ' + song.track.name + ' is ' + songTempo);

      return songTempo > searchbpm - 10 && songTempo < searchbpm + 10;
    });
    */    
    this.setState({searchResults: matchingSongs});    
  }


  addSong(song){
    this.state.playlist.push(song);
    this.state.searchResults.splice(this.state.searchResults.indexOf(song), 1 );
    this.setState({});

  }

  removeSong(song){
    let bpm = parseInt(document.getElementsByClassName('searchBar')[0].value, 10);
    if(song.bpm > bpm - 10 && song.bpm < bpm + 10) {
      this.state.searchResults.push(song);
    }
    this.state.playlist.splice(this.state.playlist.indexOf(song), 1 );
    this.setState({});

  }

  render() {
    return (
      <div className="App">
        <h1 className="title">Spotify BPM Picker</h1>
        <div className="header">This app will allow you to search for songs by BPM in your "SpotifyBPM" playlist, and add them to your "BPMWorkout" playlist.</div>

        <input className ="searchBar" placeholder="Search by BPM" onChange={this.handleSearch}></input>

        <div className='searchResultsContainer'>
          <div className='searchResultsHeader'>Search Results</div>
          <SearchResults searchResults={this.state.searchResults} addSong = {this.addSong}/>
        </div>

        <div className = 'playlistContainer'>
          <div className='playlistHeader'>Playlist</div>
          <Playlist playlist={this.state.playlist} removeSong={this.removeSong}/>
        </div>

        <LoginArea onclick={this.handleLogin} userId={this.state.userId} spotifyBPMPlaylistId={this.state.spotifyBPMPlaylistId} />

      </div>
    );
  }
}
export default App;



//stateless component
const LoginArea = (props) => {
  return(
    <div>
      <button onClick={props.onclick} className='spotifyLogin'>Click here to log in with Spotify</button>
      <div>User ID: {props.userId}</div>
      <div>Playlist ID: {props.spotifyBPMPlaylistId}</div>
    </div>
  );
}