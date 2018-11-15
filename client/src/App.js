import React, { Component } from 'react';
import { Row, Col, Button } from 'react-materialize';
import axios from 'axios';
import SpotifyPlayer from 'react-spotify-player';
import base from './base';

import SearchForm from './components/SearchForm';
import SearchResultItem from './components/SearchResultItem';
import PlaylistItem from './components/PlaylistItem';
import PlaylistRename from './components/PlaylistRename';
import LogoutBtn from './components/LogoutBtn';
import QueueList from './components/QueueList';
import CurrentUser from './components/CurrentUser';

import logo from './logo-v2.svg';
import './App.scss';

// set `SpotifyPlayer` styling
const size = {
  width: '100%',
  height: 77,
};
const view = 'list'; // or 'coverart'
const theme = 'black'; // or 'white'

class App extends Component {
  state = {
    searchResults: [],
    playlist: {
      songs: {},
      name: ''
    },
    playQueue: {},
    songToPlayUri: 'spotify:track:7o2AeQZzfCERsRmOM86EcB',
    editMode: false
  }

  componentDidMount = () => {

    this.ref = base.syncState('playlist', {
      context: this,
      state: 'playlist'
    });

    this.ref = base.syncState('playQueue', {
      context: this,
      state: 'playQueue'
    });

    // this.setState({
    //   playQueueTest: ['setting state', 'songs']
    // });

    // axios.get('/songs/')
    // .then((res) => {
    //   const songs = res.data;
    //   const playlist = {...this.state.playlist};

    //   playlist.songs = songs;
    //   this.setState({
    //     playlist
    //   });
    // });

    axios.get('/playlist/')
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
    this.setState((prevState) => ({
      searchResults: results
    }));
  }

  addSongToPlaylist = songToAdd => {
    // copy playlist state
    const playlist = {...this.state.playlist};

    /**
     * check to see if song is already in playlist via Spotify Id
     * if song is already there then return as well passing through Materialize Toast to let use know
     */
    // for(let song of playlist.songs) {
    //   if (song.spotId === songToAdd.spotId) return window.M.toast({html: `"${songToAdd.name}" is a duplicate, cannot add`, classes: 'red lighten-2'});
    // }
    // console.log(songToAdd);
    
    Object.keys(playlist.songs).map(key => {
      if (playlist.songs[key].spotId === songToAdd.spotId) return window.M.toast({html: `"${songToAdd.name}" is a duplicate, cannot add`, classes: 'red lighten-2'});
    });
    // console.log('something after');
    

    // Optimistically add song to copied playlist state
    playlist.songs[songToAdd.spotId] = songToAdd;
    this.setState({
      playlist
    });

    /**
     * Add song to DB and if successful(.then()) init Toast to inform user
     */
    // axios.post(`/songs/`, songToAdd)
    //   .then(res => {
    //     window.M.toast({html: `Added: ${res.data.name} - ${res.data.album}`, classes: 'green lighten-1'});
    //     // SHOULD BE ERROR CATCHING IN HERE!!!
    //   })
    //   .catch(err => {
    // });
  }

  // Toggle edit mode 
  handleEditModeBtn = () => {
    this.setState((prevState) => ({
      editMode: !prevState.editMode
    }));
  }

  updatePlaylistName = (newPlaylistName) => {
    const playlistCopy = {...this.state.playlist};
    playlistCopy.name = newPlaylistName;
    this.setState({
      playlist: playlistCopy,
      editMode: false
    });
  }

  addPlaylistToQueue = () => {
    const playlist = this.state.playlist;
    const copyOfPlayQueue = this.state.playQueue.slice(0); // using splice to clone state as the spread cloning loses the splice() method
    
    const songsToQueue = playlist.songs.map(song => {
      return {
        name: song.name,
        album: song.album,
        artists: song.artists,
        uri: song.uri
      }
    });

    const newQueue = [
      copyOfPlayQueue[0], // keep the first item in queue there as that doesnt want to be moved
      ...songsToQueue, // spread all songs from playlist into the queue after the first item
      ...copyOfPlayQueue.slice(1) // spread rest of the queue back into the queue after the new songs
    ];
    this.setState({
      playQueue: newQueue
    });
  }

  addSongToPlayQueue = (songToQueue) => {
    const copyOfPlayQueue = {...this.state.playQueue};

    copyOfPlayQueue[songToQueue.spotId] = songToQueue;
    
    this.setState({
      playQueue: copyOfPlayQueue
    });
  }

  removeSongFromPlayQueue = (songToDeleteSpotId) => {
    // let copyOfPlayQueue = this.state.playQueue.slice(0); // using splice to clone state as the spread cloning loses the splice() method
    const copyOfPlayQueue = {...this.state.playQueue};
    
    copyOfPlayQueue[songToDeleteSpotId] = null;
    this.setState({
      playQueue: copyOfPlayQueue
    });
  }

  // Spotify song URI as paramter and use that to set the songToPlay state and thus re-render the page and play song preview
  playSong = (songUri) => {
    const newState = {...this.state};
    newState.songToPlayUri = songUri;
    this.setState(newState);
  }

  deleteSongFromPlaylist = (songToDeleteSpotId) => {
        // Copy state.playlist
        const playlistCopy = {...this.state.playlist.songs};
        const { name, album } = playlistCopy[songToDeleteSpotId];
        
        // delete the song by setting the song we want to delete to null
        playlistCopy[songToDeleteSpotId] = null;

        this.setState({
          playlist: {
            songs: playlistCopy
          }
        });

        window.M.toast({html: `Deleted: ${name} - ${album}`, classes: 'green lighten-1'});        
  }

  render() {
    // Show either playlist title or form to change playlist title depending on editmode
    let playlistName;
    if (this.state.editMode) {
      playlistName = <PlaylistRename updatePlaylistName={this.updatePlaylistName} playlistName={this.state.playlist.name} />
    } else {
      playlistName = <h4 className="center">{this.state.playlist.name}</h4>;
    }
    if (this.state.playlist.songs  === undefined) {
    //   console.log('does this run?');
      // const playlistItems = Object.keys(this.state.playlist.songs).map(key => {
      //   return <PlaylistItem editMode={this.state.editMode} addSongToPlayQueue={this.addSongToPlayQueue} playSong={this.playSong} deleteSongFromPlaylist={this.deleteSongFromPlaylist} data={this.state.playlist.songs[key]} key={key} />
      // });
      // console.log('playlistItems: ', playlistItems);
  
      
    //   this.setState({
    //     playlist: {
    //       songs: {
    //         '5be49e747b45f315429cf057': {
    //           name: 'no data',
    //           album: 'no data',
    //           artists: [{
    //             name: 'no data'
    //           }],
    //           image: 'no data',
    //           spotId: 'no data',
    //           uri: 'no data'
    //         }
    //       }
    //     }
    //   });
    }
    // console.log('this.state.playlist.songs: ', this.state.playlist.songs);
    
    return (
      <div className="container">

        <Row>
          <Col s={4} offset={"s1"} className='center logo'>
            <SpotifyPlayer
                uri={this.state.songToPlayUri}
                size={size}
                view={view}
                theme={theme}
              />
          </Col>
          <Col s={2} className='center logo'>
            <img alt="qupp logo" src={logo} />
          </Col>
          <Col s={4} offset={"s1"} className=''>
            <CurrentUser currentUser={this.props.currentUser} />
            <LogoutBtn updateLoginState={this.props.updateLoginState} />
          </Col>
        </Row>

        <Row>

          <Col s={6} className='grid-example'>
            <Row>
              <Col s={9} offset={"s1"}>
                {playlistName}
              </Col>
              <Col s={2} className="valign-wrapper playlistSettingsCol">
                <Button onClick={this.handleEditModeBtn} icon="settings" className="right orange lighten-2"></Button>
                <Button onClick={this.addPlaylistToQueue} icon="playlist_add" className="right green lighten-2"></Button>
              </Col>
            </Row>
            <div className="playlist-con">
              {Object.keys(this.state.playlist.songs).map(key => {
                  return <PlaylistItem editMode={this.state.editMode} addSongToPlayQueue={this.addSongToPlayQueue} playSong={this.playSong} deleteSongFromPlaylist={this.deleteSongFromPlaylist} data={this.state.playlist.songs[key]} key={key} />
              })}
            </div>
          </Col>  

          <Col s={6} className='grid-example'>
            <h4 className="center">Search</h4>
            <SearchForm addSearchResultsToState={this.addSearchResultsToState} />
            
            {Object.keys(this.state.playQueue).map(key => {
              return <QueueList data={this.state.playQueue[key]} removeSongFromPlayQueue={this.removeSongFromPlayQueue} key={key} index={key} />
            })}
            {Object.keys(this.state.searchResults).map(key => {
              return <SearchResultItem addSongToPlayQueue={this.addSongToPlayQueue} addSongToPlaylist={this.addSongToPlaylist} data={this.state.searchResults[key]} key={key} />
            })}
          </Col>

        </Row>

      </div>
    );
  }
}

export default App;
