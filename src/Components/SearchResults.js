import React, { Component } from 'react';
import {SearchItem} from './SearchItem';
import './SearchResults.css';

export class SearchResults extends Component {



    render(){
        return(
            <div className="results">

                {this.props.searchResults.map(result => {
                        return <SearchItem key={result.id} song={result} />
                    })
                }
            </div>
        )
    }
}