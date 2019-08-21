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
const API_ID = 'http://www.omdbapi.com/?apikey=b8353182&i=';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      searchQuery: '',
      searchResults: [],
      totalSearchResults: 0,
      pagesHtml: '',
      movieInfo: '',
    };

    this.searchSubmit = this.searchSubmit.bind(this);
    this.closeWindow = this.closeWindow.bind(this);
    this.renderSearchResults = this.renderSearchResults.bind(this);
    this.paginateSearchResults = this.paginateSearchResults.bind(this);
    this.showMovieInfo = this.showMovieInfo.bind(this);

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

  showMovieInfo(event){
    var et = event.target;
    var nn = et.nodeName;
    var id = null;
    if (nn==='H3'||nn==='P'){
      id = et.parentElement.getAttribute('id');
    } else {
      id = et.getAttribute('id');
    }
    fetch(API_ID+id)
      .then(response => response.json())
      .then(response => this.setState({movieInfo: [response]}));
      console.log(this.state.movieInfo);
    document.getElementById('Movie-info').scrollTop = 0;
    document.getElementById('Search-results').classList.remove('visible');
    document.getElementById('Movie-info').classList.add('visible');
  }

  renderSearchResults(){
    if (this.state.searchResults.Search){
      console.log(this.state.searchResults.Search.length + ' of ' + this.state.searchResults.totalResults + ' Results:');
      for (var i = 0; i < this.state.searchResults.Search.length; i++){
        var thisResult = this.state.searchResults.Search[i]
        console.log(thisResult);
        this.setState({ totalSearchResults: this.state.searchResults.totalResults });
      }
    } else {
      console.log('No results');
      this.setState({ totalSearchResults: 0 });
    }
    this.paginateSearchResults();
    document.getElementById('Search-results').classList.add('visible');
  }

  paginateSearchResults(){
    var pages = Math.ceil(this.state.totalSearchResults/10);
    var pagesHtml = `Page 1 of ${pages}`;
    this.setState({ pagesHtml: pagesHtml });
  }

  closeWindow(event){
    document.getElementById('Search-results').classList.add('visible');
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
        <header className="App-window visible" id="Splash">
          <h1><FontAwesomeIcon icon="film" /> The Movie Wiki <FontAwesomeIcon icon="film" /></h1>
          <p>www.themovie.wiki</p>
          <form className="Splash-search">
            <input type="text" id="Search-input" autoComplete="off" placeholder="Search movies, series & games..." aria-label="Search input"/>
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
          <div id="Search-results-wrapper">
            {this.state.searchResults.Search && this.state.searchResults.Search.map(function(item, index){
              return <div className="Search-result" onClick={this.showMovieInfo} id={item.imdbID} key={item.imdbID}><h3>{item.Title}</h3><p>({ capitalizeFirstLetter(item.Type) } - { item.Year })</p></div>
            },this)}
          </div>
          <div id="Search-results-pagination">
            <div id="Search-results-prev" className="Search-page">
              <FontAwesomeIcon icon="caret-left" />
            </div>
            <div id="Search-results-pages">
              <h2>{this.state.pagesHtml}</h2>
            </div>
            <div id="Search-results-next" className="Search-page">
              <FontAwesomeIcon icon="caret-right" />
            </div>
          </div>
        </div>
        <div className="App-window" id="Movie-info">
          <div className="Close-window" onClick={this.closeWindow}>
            <FontAwesomeIcon className="fa-2x" icon="times" />
          </div>
          <div className="Movie-inner-wrapper">
            {this.state.movieInfo && this.state.movieInfo.map((item,index) => {
                return <div key={index}> <div className="Movie-header">
                    <img src={item.Poster} className="poster" alt={item.Title} /><h1>{item.Title}</h1><h2>({capitalizeFirstLetter(item.Type)} - {item.Year})</h2><p>{item.Plot}</p>
                  </div>
                  <ul className="Movie-ratings">

                  </ul>
                  <div className="Movie-meta">
                    <ul>
                      <li><h3>Director</h3> {item.Director}</li>
                      <li><h3>Written by</h3> {item.Writer.replace(/ by\)/g,')')}</li>
                      <li><h3>Main Actors</h3> {item.Actors}</li>
                      <li><h3>Genre</h3> {item.Genre}</li>
                      <li><h3>Released</h3> {item.Released}</li>
                      <li><h3>Runtime</h3> {item.Runtime}</li>
                      <li><h3>Genre</h3> {item.Genre}</li>
                      <li><h3>Awards</h3> {item.Awards}</li>
                    </ul>
                  </div>
                </div>
            },this)}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
