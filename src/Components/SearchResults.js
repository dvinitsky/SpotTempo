import React, { Component } from 'react';
import {SearchItem} from './SearchItem';

export class SearchResults extends Component {

    render(){
      return(
        <div className="searchResults">

          {this.props.searchResults.map(result => {
             return <SearchItem key={result.id} song={result} addSong = {this.props.addSong}/>
          })}

        </div>
        )
    }
}