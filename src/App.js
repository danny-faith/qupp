import React, { Component } from 'react';
import { Row, Col, Button } from 'react-materialize';
import axios from 'axios';
// import songs from './loadPlaylist';
import SpotifyPlayer from 'react-spotify-player';
import SearchForm from './components/SearchForm';
import SearchResultItem from './components/SearchResultItem';
import PlaylistItem from './components/PlaylistItem';
import logo from './logo-v2.svg';
import './App.scss';
import CurrentUser from './components/CurrentUser';

// To make playlist persitant, load playlist from database and put it in `playlist` state
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
    playlist: [],
    songToPlayUri: '',
    editMode: false
  }
  componentDidMount = () => {
    var songs = {};
    axios.get('http://localhost:8080/songs/')
    .then((res) => {
      var songs = res.data;
      this.setState({
        playlist: songs
      });
      // console.log('songs: ', songs);
    });
    // axios.get('http://localhost:8080/authspotify')
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

    const playlist = this.state.playlist;
    // TODO: check if object item is already there!!
    // if(!playlist.hasOwnProperty(song)) {
      playlist[song.spotId] = song;
      this.setState({
        playlist: playlist
      });
      axios.post(`http://localhost:8080/songs/`, song)
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
  handleEditModeBtn = () => {
    this.setState((prevState) => ({
      editMode: !prevState.editMode
    }));
    console.log('this.state.editMode: ', this.state.editMode);
  }
  playSong = songUri => {
    // update songToPlay state so the Spotify player re-renders
    const songToPlayCopy = [...this.state.songToPlayUri];
    this.setState({
      songToPlayUri: songUri
    });
  }
  deleteSongFromPlaylist = songToDeleteId => {

    axios.delete(`http://localhost:8080/songs/${songToDeleteId}`)
      .then(() => {
        // Copy state.playlist
        const playlistCopy = [...this.state.playlist];
        // Find the index of the object we want to delete
        const index = playlistCopy.findIndex(obj => obj._id === songToDeleteId);
        // Remove chosen object to delete by adding all other object back in around our chosen object
        const newPlaylist = [
            ...playlistCopy.slice(0, index),
            ...playlistCopy.slice(index + 1)
        ];
        this.setState({
          playlist: newPlaylist
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
      <div className="container">
        <Row>
          <Col s={2} offset={"s5"} className='center logo'><img src={logo} /></Col>
          <Col s={3} className=''>
            <CurrentUser currentUser={this.props.currentUser} />
          </Col>
        </Row>
        <Row>
          <Col s={4} className='grid-example'>
            <h3 className="center">Playlist</h3>
            <Button onClick={this.handleEditModeBtn}>Edit</Button>
            {Object.keys(this.state.playlist).map(key => {
                return <PlaylistItem editMode={this.state.editMode} playSong={this.playSong} deleteSongFromPlaylist={this.deleteSongFromPlaylist} data={this.state.playlist[key]} key={key} />
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
            <SpotifyPlayer
              uri={this.state.songToPlayUri}
              size={size}
              view={view}
              theme={theme}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
