import React, { Component } from 'react';
import './App.css';
import {SearchResults} from './Components/SearchResults';
import {Playlist} from './Components/Playlist';
import LoginArea from './Components/LoginArea';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.addSong = this.addSong.bind(this);
    this.removeSong = this.removeSong.bind(this);

    this.state = {
      bpmPlaylist: [
        {id: 0,
        title: "Worldwide Choppers",
        artist: "Tech Nine",
        bpm: "150"},
        {id: 1,
        title: "Yellow",
        artist: "Coldplay",
        bpm: "87"},
        {id: 2,
        title: "Misery Loves Company",
        artist: "Rittz",
        bpm: "125"},
        {id: 3,
        title: "In My Zone",
        artist: "Rittz",
        bpm: "70"},
        {id: 4,
        title: "Just Dance",
        artist: "Lady Gaga",
        bpm: "155"},
        {id: 5,
        title: "Midwest Choppers",
        artist: "Tech Nine",
        bpm: "138"},
        {id: 6,
        title: "Bonfire",
        artist: "Childish Gamino",
        bpm: "120"},
        {id: 7,
        title: "This is America",
        artist: "Childish Gambino",
        bpm: "108"},
        {id: 8,
        title: "Stronger",
        artist: "Kanye West",
        bpm: "100"}
      ],
      searchResults: [],
      playlist: []
    }
  }

  handleSearch(e){
    let searchbpm = parseInt(e.target.value, 10);

    let matchingSongs = this.state.bpmPlaylist.filter(x => {
      return x.bpm > searchbpm - 10 && x.bpm < searchbpm + 10;
    });    
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

        <LoginArea />

      </div>
    );
  }
}

export default App;