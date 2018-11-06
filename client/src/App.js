import React, { Component } from 'react';
import { Row, Col, Button } from 'react-materialize';
import axios from 'axios';
// import songs from './loadPlaylist';
import SpotifyPlayer from 'react-spotify-player';
import SearchForm from './components/SearchForm';
import SearchResultItem from './components/SearchResultItem';
import PlaylistItem from './components/PlaylistItem';
import PlaylistRename from './components/PlaylistRename';
import LogoutBtn from './components/LogoutBtn';
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
    playlist: {
      songs: [],
      name: ''
    },
    songToPlayUri: 'spotify:track:7o2AeQZzfCERsRmOM86EcB',
    editMode: false
  }

  componentDidMount = () => {
    // var songs = {};

    axios.get('http://localhost:8080/songs/')
    .then((res) => {
      var songs = res.data;
      const playlist = {...this.state.playlist};

      playlist.songs = songs;
      this.setState({
        playlist
      });
    });

    axios.get('http://localhost:8080/playlist/')
    .then((res) => {
      const newPlaylistName = res.data[0].name;
      let playlist = {...this.state.playlist};
      playlist.name = newPlaylistName;

      this.setState({
        playlist
      });
    });
  }
  addSearchResultsToState = (results) => {
    // console.log('results from App.js: ', results);
    this.setState((prevState) => ({
      searchResults: results
    }));
    // console.log(this.state);  
  }
  addSongToPlaylist = song => {

    const playlist = {...this.state.playlist};
    // TODO: check if object item is already there otherwise it ends up in state and shows. But then once refresed isn't there as DB rejected it based on schema
    // if(!playlist.hasOwnProperty(song)) {
      playlist.songs[song.spotId] = song;
      this.setState({
        playlist
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
    // console.log('this.state.editMode: ', this.state.editMode);
  }
  updatePlaylistName = (newPlaylistName) => {
    // console.log('newPlaylistName: ', newPlaylistName);
    
    // console.log(playlistInput);
    
    const playlistCopy = {...this.state.playlist};
    playlistCopy.name = newPlaylistName;
    this.setState({
      playlist: playlistCopy,
      editMode: false
    });
  }
  playSong = songUri => {
    const newState = {...this.state};
    newState.songToPlayUri = songUri;
    this.setState(newState);
  }
  deleteSongFromPlaylist = songToDeleteId => {

    axios.delete(`http://localhost:8080/songs/${songToDeleteId}`)
      .then(() => {
        // Copy state.playlist
        const playlistCopy = [...this.state.playlist.songs];
        // Find the index of the object we want to delete
        const index = playlistCopy.findIndex(obj => obj._id === songToDeleteId);
        // Remove chosen object to delete by adding all other object back in around our chosen object
        const newPlaylist = [
            ...playlistCopy.slice(0, index),
            ...playlistCopy.slice(index + 1)
        ];
        this.setState({
          playlist: {
            songs: newPlaylist
          }
        });
      })
      .catch(function (error) {
        console.log('error: ', error);
        console.log('error.config: ', error.config);
      });
    // TODO remove form DB. Maybe just 
  }
  render() {
    let playlistName;
    if (this.state.editMode) {
      playlistName = <PlaylistRename updatePlaylistName={this.updatePlaylistName} playlistName={this.state.playlist.name} />
    } else {
      playlistName = <h3 className="center">{this.state.playlist.name}</h3>;
    }
    return (
      <div className="container">
        <Row>
          <Col s={2} offset={"s5"} className='center logo'>
            <img src={logo} />
          </Col>
          <Col s={3} className=''>
            <CurrentUser currentUser={this.props.currentUser} />
            <LogoutBtn updateLoginState={this.props.updateLoginState} />
          </Col>
        </Row>
        <Row>
          <Col s={4} className='grid-example'>
            <Row>
              <Col s={8} offset={"s2"}>
                {playlistName}
              </Col>
              <Col s={2} className="valign-wrapper playlistSettingsCol">
                <Button onClick={this.handleEditModeBtn} icon="settings" className="right orange lighten-2"></Button>
              </Col>
            </Row>
            {Object.keys(this.state.playlist.songs).map(key => {
                return <PlaylistItem editMode={this.state.editMode} playSong={this.playSong} deleteSongFromPlaylist={this.deleteSongFromPlaylist} data={this.state.playlist.songs[key]} key={key} />
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
