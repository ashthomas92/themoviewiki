import React, { Component } from 'react';
import './App.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faFilm } from '@fortawesome/free-solid-svg-icons'

library.add(
  faSearch,
  faFilm
)

const API_Search = 'http://www.omdbapi.com/?apikey=b8353182&s=';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      searchResults: null,
      searchResultsHtml: ''
    };

    this.searchSubmit = this.searchSubmit.bind(this);
    this.renderSearchResults = this.renderSearchResults.bind(this);

  }

  searchSubmit(event){
    event.preventDefault();
    var query = document.getElementById('Search-input').value;
    console.log('Searching for ' + query + ' (' + API_Search + query + ')');
    fetch(API_Search+query)
      .then(response => response.json())
      .then(response => this.setState({ searchResults: response.Search }))
      .then(response => this.renderSearchResults());
  }

  renderSearchResults(){
    if (this.state.searchResults){
      console.log('STATE');
      console.log(this.state.searchResults);
      console.log('LOOP');
      for (var i = 0; i < this.state.searchResults.length; i++){
        console.log(this.state.searchResults[i]);
      }
    } else {
      console.log('No results');
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-window">
          <h1><FontAwesomeIcon icon="film" /> The Movie Wiki <FontAwesomeIcon icon="film" /></h1>
          <p>www.themovie.wiki</p>
          <form className="Splash-search">
            <input type="text" id="Search-input" placeholder="Search movies, series & episodes..." aria-label="Search input"/>
            <button type="submit" aria-label="Search submit button" onClick={this.searchSubmit}>
              <FontAwesomeIcon icon="search" />
            </button>
          </form>
        </header>
        <div className="App-window" id="Search-results">
          <p>Search Results</p>
        </div>
      </div>
    );
  }
}

export default App;
