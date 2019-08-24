import React, { Component } from 'react';
import './App.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faFilm, faTimes, faCaretLeft, faCaretRight, faStar } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

library.add(
  faSearch,
  faFilm,
  faTimes,
  faCaretLeft,
  faCaretRight,
  faGithub,
  faStar
)

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const API_Search = 'http://www.omdbapi.com/?apikey=b8353182&s=';
const API_ID = 'http://www.omdbapi.com/?apikey=b8353182&plot=full&i=';





class App extends Component {

  componentDidMount() {
    window.addEventListener('load', this.handleLoad);
  }

  handleLoad() {
    document.getElementById('Search-input').focus();
  }

  constructor(props) {
    super(props);

    this.state = {
      searchQuery: '',
      searchResults: [],
      totalSearchResults: 0,
      totalPages: 1,
      currentPage: 1,
      pagesHtml: '',
      movieInfo: '',
      moveRatings: '',
    };

    this.searchSubmit = this.searchSubmit.bind(this);
    this.closeWindow = this.closeWindow.bind(this);
    this.renderSearchResults = this.renderSearchResults.bind(this);
    this.paginateSearchResults = this.paginateSearchResults.bind(this);
    this.showMovieInfo = this.showMovieInfo.bind(this);
    this.openAbout = this.openAbout.bind(this);
    this.prevSearchPage = this.prevSearchPage.bind(this);
    this.nextSearchPage = this.nextSearchPage.bind(this);

  }

  searchSubmit(event){
    event.preventDefault();
    var query = document.getElementById('Search-input').value;
    this.setState({ searchQuery: query, currentPage: 1 });
    fetch(API_Search+query)
      .then(response => response.json())
      .then(response => this.setState({ searchResults: response }))
      .then(response => this.renderSearchResults());
    document.getElementById('Search-results').scrollTop = 0;
    document.getElementById('Search-results-prev').classList.add('disabled');
    document.getElementById('Search-input').blur();
  }

  showMovieInfo(event){
    this.setState({movieInfo: []});
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
      .then(response => this.setState({movieInfo: [response], movieRatings: response.Ratings }));
    document.getElementById('Movie-info').scrollTop = 0;
    document.getElementById('Movie-info').classList.add('visible');
  }

  renderSearchResults(){
    if (this.state.searchResults.Search){
      for (var i = 0; i < this.state.searchResults.Search.length; i++){
        this.setState({ totalSearchResults: this.state.searchResults.totalResults });
      }
    } else {
      this.setState({ totalSearchResults: 0 });
    }
    this.paginateSearchResults();
    document.getElementById('Search-results').classList.add('visible');
  }

  openAbout(){
    document.getElementById('About-page').classList.add('visible');
  }

  paginateSearchResults(){
    var pages = Math.ceil(this.state.totalSearchResults/10);
    var pagesHtml = `Page ${this.state.currentPage} of ${pages}`;
    this.setState({ pagesHtml: pagesHtml, totalPages: pages });
    if (pages<=1){
      document.getElementById('Search-results-next').classList.add('disabled');
    } else if (this.state.currentPage<pages) {
      document.getElementById('Search-results-next').classList.remove('disabled');
    }
  }

  closeWindow(event){
    var node = event.target.nodeName;
    var parent = '';
    if (node==='svg'){
      event.target.parentElement.parentElement.classList.remove('visible');
      parent = event.target.parentElement.parentElement.id;
    } else if (node==='path') {
      event.target.parentElement.parentElement.parentElement.classList.remove('visible');
      parent = event.target.parentElement.parentElement.parentElement.id;
    }
    if (parent==='Search-results'){
      var searchInput = document.getElementById('Search-input');
      searchInput.focus();
      searchInput.value = '';
    }
  }

  prevSearchPage(){
    var searchPage = this.state.currentPage;
    if (searchPage>1){
      this.setState({ currentPage: searchPage-1 });
      fetch(API_Search+this.state.searchQuery+'&page='+(this.state.currentPage-1))
        .then(response => response.json())
        .then(response => this.setState({ searchResults: response }))
        .then(response => this.renderSearchResults());
      document.getElementById('Search-results').scrollTop = 0;
      this.paginateSearchResults();
      document.getElementById('Search-results-next').classList.remove('disabled');
      if (searchPage===2) {
        document.getElementById('Search-results-prev').classList.add('disabled');
      }
    }
  }

  nextSearchPage(){
    var searchPage = this.state.currentPage;
    if (searchPage<this.state.totalPages){
      this.setState({ currentPage: searchPage+1 });
      fetch(API_Search+this.state.searchQuery+'&page='+(this.state.currentPage+1))
        .then(response => response.json())
        .then(response => this.setState({ searchResults: response }))
        .then(response => this.renderSearchResults())
        .then(document.getElementById('Search-results').scrollTop = 0);

      this.paginateSearchResults();
      document.getElementById('Search-results-prev').classList.remove('disabled');
      console.log(searchPage+1);
      console.log(this.state.totalPages);
      if ((searchPage+1)===this.state.totalPages) {
        console.log('match');
        document.getElementById('Search-results-next').classList.add('disabled');
      }
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
          <div className="About-link" onClick={this.openAbout}>
            <span>about</span>
          </div>
        </header>
        <div className="App-window" id="Search-results">
          <div className="Close-window" onClick={this.closeWindow}>
            <FontAwesomeIcon className="fa-2x" icon="times" />
          </div>
          <h2>{this.state.totalSearchResults} results for <em>{this.state.searchQuery}</em></h2>
          <div id="Search-results-wrapper">
            {this.state.searchResults.Search && this.state.searchResults.Search.map((item, index) => {
              return <div className="Search-result" onClick={this.showMovieInfo} id={item.imdbID} key={item.imdbID}><h3>{item.Title}</h3><p>({ capitalizeFirstLetter(item.Type) } - { item.Year })</p></div>
            })}
          </div>
          <div id="Search-results-pagination">
            <div id="Search-results-prev" className="Search-page disabled" onClick={this.prevSearchPage}>
              <FontAwesomeIcon icon="caret-left" />
            </div>
            <div id="Search-results-pages">
              <h2>{this.state.pagesHtml}</h2>
            </div>
            <div id="Search-results-next" className="Search-page" onClick={this.nextSearchPage}>
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
                    {this.state.movieRatings && this.state.movieRatings.map((item,index) => {
                      return <li key={index}><FontAwesomeIcon icon="star" /> {item.Source}: {item.Value} <FontAwesomeIcon icon="star" /></li>
                    })}
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
            })}
          </div>
        </div>
        <div className="App-window" id="About-page">
          <div className="Close-window" onClick={this.closeWindow}>
            <FontAwesomeIcon className="fa-2x" icon="times" />
          </div>
          <p>The Movie Wiki is a pet project by Ash Thomas at <a href="https://southdevondigital.com" target="_blank" rel="noopener noreferrer">South Devon Digital</a>.
            <br /><br />
            It's a React App that uses the <a href="https://ombdapi.com" target="_blank" rel="noopener noreferrer">Open Movie Database API</a>.</p>
          <p><FontAwesomeIcon icon={['fab','github']} /> <a href="https://github.com/ashthomas92/themoviewiki" target="_blank" rel="noopener noreferrer"> View the source code on Github</a></p>
        </div>
      </div>
    );
  }
}

export default App;
