import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import axios from 'axios';
// import songs from './loadPlaylist';
import SpotifyPlayer from 'react-spotify-player';
import SearchForm from './components/SearchForm';
import SearchResultItem from './components/SearchResultItem';
import Login from './components/Login';
import PlaylistItem from './components/PlaylistItem';
// import logo from './logo.svg';
import './App.scss';

// To make playlist persitant, load playlist from database and put it in `playList` state
// or maybe localStorage, but that may come later

const size = {
  width: '100%',
  height: 520,
};
const view = 'list'; // or 'coverart'
const theme = 'black'; // or 'white'

class App extends Component {
  state = {
    searchResults: [],
    playList: [],
    songToPlayUri: ''
  }
  componentDidMount = () => {
    var songs = {};
    axios.get('http://localhost:3333/songs/')
    .then((res) => {
      var songs = res.data;
      this.setState({
        playList: songs
      });
      // console.log('songs: ', songs);
    });
    // axios.get('http://localhost:3333/authspotify')
    // .then((res) => {
    //   console.log('Anything??');
      
    //   console.log('res: ', res);
    // });
  }
  addSearchResultsToState = (results) => {
    console.log('results from App.js: ', results);
    this.setState((prevState) => ({
      searchResults: results
    }));
    console.log(this.state);    
  }
  addSongToPlaylist = song => {

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
          // SHOULD BE ERROR CATCHING IN HERE!!!
        });
    // } else if (song == undefined) {
    //   console.log('empty string');
    // } else {
    //   console.log('it was already there');
    // }
  }
  playSong = songUri => {
    // update songToPlay state so the Spotify player re-renders
    const songToPlayCopy = [...this.state.songToPlayUri];
    this.setState({
      songToPlayUri: songUri
    });
  }
  deleteSongFromPlaylist = songToDeleteId => {

    axios.delete(`http://localhost:3333/songs/${songToDeleteId}`)
      .then(() => {
        // Copy state.playList
        const playlistCopy = [...this.state.playList];
        // Find the index of the object we want to delete
        const index = playlistCopy.findIndex(obj => obj._id === songToDeleteId);
        // Remove chosen object to delete by adding all other object back in around our chosen object
        const newPlaylist = [
            ...playlistCopy.slice(0, index),
            ...playlistCopy.slice(index + 1)
        ];
        this.setState({
          playList: newPlaylist
        });
      })
      .catch(function (error) {
        console.log('error: ', error);
        console.log('error.config: ', error.config);
      });
    // TODO remove form DB. Maybe just 
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
                return <PlaylistItem playSong={this.playSong} deleteSongFromPlaylist={this.deleteSongFromPlaylist} data={this.state.playList[key]} key={key} />
            })}
          </Col>
          <Col s={4} className='grid-example'>
            <h3 className="center">Login</h3>
            <Login />
            <h3 className="center">Search</h3>
            <SearchForm addSearchResultsToState={this.addSearchResultsToState} />
            {Object.keys(this.state.searchResults).map(key => {
                return <SearchResultItem addSongToPlaylist={this.addSongToPlaylist} data={this.state.searchResults[key]} key={key} />
            })}
          </Col>
          <Col s={4} className='grid-example'>
            <h3 className="center">Player</h3>
            <SpotifyPlayer
              uri={this.state.songToPlayUri}
              size={size}
              view={view}
              theme={theme}
            />
          </Col>
        </Row>
      </>
    );
  }
}

export default App;
