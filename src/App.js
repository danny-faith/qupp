import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import axios from 'axios';
import SearchForm from './components/SearchForm';
import SearchResultItem from './components/SearchResultItem';
import PlaylistItem from './components/PlaylistItem';
import logo from './logo.svg';
import './App.scss';

class App extends Component {
  state = {
    searchResults: [],
    playList: []
  }
  addSearchResultsToState = (results) => {
    console.log('results from App.js: ', results);
    this.setState((prevState) => ({
      searchResults: results
    }));
    console.log(this.state);    
  }
  addSongToPlaylist = song => {
    console.log('addSongToPlaylist: ', song);
    // this.setState((prevState) => ({
    //   playList: song
    // }));
    const playList = this.state.playList;
    // TODO: check if object item is already there!!
    // if(!playList.hasOwnProperty(song)) {
      playList[song.spotId] = song;
      this.setState({
        playList: playList
      });
      axios.post(`http://localhost:3333/songs/`, song)
        .then(res => {
          console.log(res);
          
        });
    // } else if (song == undefined) {
    //   console.log('empty string');
    // } else {
    //   console.log('it was already there');
    // }
  }
  deleteSongFromPlaylist = songId => {
    console.log('deleteSongFromPlaylist: ', songId);
  }
  render() {
    return (
      <>
        <Row>
          <Col s={12} className='center'><h1>qupp</h1></Col>
        </Row>
        <Row>
          <Col s={4} className='grid-example'>
            <h3 className="center">Playlist</h3>
            {Object.keys(this.state.playList).map(key => {
                return <PlaylistItem deleteSongFromPlaylist={this.deleteSongFromPlaylist} data={this.state.playList[key]} key={key} />
            })}
          </Col>
          <Col s={4} className='grid-example'>
            <h3 className="center">Search</h3>
            <SearchForm addSearchResultsToState={this.addSearchResultsToState} />
            {Object.keys(this.state.searchResults).map(key => {
                return <SearchResultItem addSongToPlaylist={this.addSongToPlaylist} data={this.state.searchResults[key]} key={key} />
            })}
          </Col>
          <Col s={4} className='grid-example'>
            <h3 className="center">Player</h3>
          </Col>
        </Row>
      </>
    );
  }
}

export default App;
