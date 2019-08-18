import React, { Component } from 'react';
import './App.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faFilm, faTimes, faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons'

library.add(
  faSearch,
  faFilm,
  faTimes,
  faCaretLeft,
  faCaretRight
)

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const API_Search = 'http://www.omdbapi.com/?apikey=b8353182&s=';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      searchQuery: '',
      searchResults: null,
      searchResultsHtml: '',
      totalSearchResults: 0,
      pagesHtml: ''
    };

    this.searchSubmit = this.searchSubmit.bind(this);
    this.closeWindow = this.closeWindow.bind(this);
    this.renderSearchResults = this.renderSearchResults.bind(this);
    this.paginateSearchResults = this.paginateSearchResults.bind(this);

  }

  searchSubmit(event){
    event.preventDefault();
    var query = document.getElementById('Search-input').value;
    this.setState({ searchQuery: query });
    console.log('Searching for ' + query + ' (' + API_Search + query + ')');
    fetch(API_Search+query)
      .then(response => response.json())
      .then(response => this.setState({ searchResults: response }))
      .then(response => this.renderSearchResults());
    document.getElementById('Search-results').scrollTop = 0;
  }

  renderSearchResults(){
    if (this.state.searchResults.Search){
      document.getElementById('Search-results').classList.add('visible');
      console.log(this.state.searchResults.Search.length + ' of ' + this.state.searchResults.totalResults + ' Results:');
      for (var i = 0; i < this.state.searchResults.Search.length; i++){
        var thisResult = this.state.searchResults.Search[i]
        console.log(thisResult);
        this.setState({ totalSearchResults: this.state.searchResults.totalResults });
        this.setState({ searchResultsHtml: this.state.searchResultsHtml + '<div class="Search-result"><h3>' + thisResult.Title + '</h3><p>('  + capitalizeFirstLetter(thisResult.Type) + ' - ' + thisResult.Year + ')</p></div>' });
      }
    } else {
      console.log('No results');
      this.setState({ searchResultsHtml: 'No results' });
    }
    console.log(this.state.searchResultsHtml);
    this.paginateSearchResults();
  }

  paginateSearchResults(){
    var pages = Math.ceil(this.state.totalSearchResults/10);
    var pagesHtml = `Page 1 of ${pages}`;
    this.setState({ pagesHtml: pagesHtml });
  }

  closeWindow(event){
    var node = event.target.nodeName;
    if (node==='svg'){
      event.target.parentElement.parentElement.classList.remove('visible');
    } else if (node==='path') {
      event.target.parentElement.parentElement.parentElement.classList.remove('visible');
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-window visible">
          <h1><FontAwesomeIcon icon="film" /> The Movie Wiki <FontAwesomeIcon icon="film" /></h1>
          <p>www.themovie.wiki</p>
          <form className="Splash-search">
            <input type="text" id="Search-input" autocomplete="off" placeholder="Search movies, series & episodes..." aria-label="Search input"/>
            <button type="submit" aria-label="Search submit button" onClick={this.searchSubmit}>
              <FontAwesomeIcon icon="search" />
            </button>
          </form>
        </header>
        <div className="App-window" id="Search-results">
          <div className="Close-window" onClick={this.closeWindow}>
            <FontAwesomeIcon className="fa-2x" icon="times" />
          </div>
          <h2>{this.state.totalSearchResults} results for <em>{this.state.searchQuery}</em></h2>
          <div id="Search-results-wrapper" dangerouslySetInnerHTML={{__html: this.state.searchResultsHtml}}></div>
          <div id="Search-results-pagination">
            <div id="Search-results-prev" class="Search-page">
              <FontAwesomeIcon icon="caret-left" />
            </div>
            <div id="Search-results-pages">
              <h2>{this.state.pagesHtml}</h2>
            </div>
            <div id="Search-results-next" class="Search-page">
              <FontAwesomeIcon icon="caret-right" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
