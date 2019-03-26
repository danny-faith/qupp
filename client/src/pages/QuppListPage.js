import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import base from '../base';
import PropTypes from 'prop-types';
import { getPlaylist, clearPlaylists } from '../actions/playlistActions';
import isEmpty from '../utils/isEmpty';

import { Row, Col, Button } from 'react-materialize';

import SearchForm from '../components/SearchForm';
import Header from '../components/common/Header';
import Song from '../components/playlist/Song';

import { MyProvider } from '../context';

class QuppListPage extends Component {
  state = { 
    playlist: {
      songs: [],
      queue: [],
    },
    nowPlaying: {
      name: '',
      artists: [],
      album: '',
      duration_ms: '' ,
      spotId: ''
    },
    upNext: {
      name: '',
      artists: [],
      album: '',
      duration_ms: '' ,
      spotId: ''
    },
    searchResults: []
  }
  componentDidMount = () => {
    console.log('componentDidMount');
    
    // sync to user speicific playlist
    base.syncState(`playlists/${this.props.match.params.playlist_id}`, {
      context: this,
      state: 'playlist',
      then() {
        // render play button - then()
      }
    });

    this.props.clearPlaylists();
    this.props.getPlaylist(this.props.match.params.playlist_id);    
  }
  playClickHandler = () => {
    this.populateNowPlaying(true);  
    this.populateUpNext();
  }
  playSong = () => {
    const { duration_ms } = this.state.nowPlaying;
    console.log('duration_ms: ', duration_ms);
    setTimeout(() => {
      console.log('song complete');
      this.playNextSong();
    }, duration_ms / 50);
    // play song
    // colour first item in queue
    // colour second item in queue
    // once song ends copy state and remove first item from queue
    // re-colour two top songs
    // update nowPlaying and upNext
    // play song
  }
  playNextSong = () => {
    // Remove first song from queue
    const copyOfPlaylist = {...this.state.playlist};
    copyOfPlaylist.queue.shift();
    this.setState({playlist: copyOfPlaylist}, () => {
      this.populateUpNext();
      this.populateNowPlaying(true);
    });
  }
  componentWillUpdate = (stuff) => {
    // FOR TESTING. CHECK HOW MANY TIMES `componentWillUpdate` runs
  }
  populateNowPlaying = (play) => {
    let nowPlaying = {...this.state.nowPlaying};
    nowPlaying = this.state.playlist.queue[0];
    const playBool = (play) ? this.playSong : null;
    // this.playSong should not be in callback. Makes function less versatile
    this.setState({nowPlaying}, playBool);
  }
  populateUpNext = () => {
    let upNext = {...this.state.upNext};
    upNext = this.state.playlist.queue[1];
    this.setState({upNext});
  }
  addSearchResultsToState = (results) => {
    this.setState(() => ({
      searchResults: results
    }));
  }
  addSongToQueueOrPlaylist = (songToAdd, type) => {
    const errors = {};
    const playlist = {...this.state.playlist};

    Object.keys(playlist.songs).map(key => {
      if (playlist.songs[key].spotId === songToAdd.spotId) {
        errors.addSong = `"${songToAdd.name}" is a duplicate, cannot add`;
      }
    });

    if(!isEmpty(errors)) {
      return window.M.toast({html: errors.addSong, classes: 'red lighten-2'})
    }
    
    if (this.state.playlist.hasOwnProperty(type)) {
      playlist[type].unshift(songToAdd);
    } else {
      playlist[type] = [];
      playlist[type].unshift(songToAdd);
    }

    this.setState({
      playlist
    });
  }
  removeSongFromQueueOrPlaylist = (songIdToRemove, type) => {
    
    const copyOfPlaylist = {...this.state.playlist};
    const index = copyOfPlaylist[type].findIndex(x => x.spotId === songIdToRemove);
    copyOfPlaylist[type].splice(index, 1);
    
    this.setState({
      playlist: copyOfPlaylist
    });
  }
  render() {
    let playlistContent = '';
    let playlistName = '';
    let queueContent = '';
    // wonder if isEmpty would work below?
    if (this.state.playlist.hasOwnProperty('songs') && Object.keys(this.state.playlist.songs).length > 0){
      playlistContent = 
      Object
      .keys(this.state.playlist.songs)
      .map(key => 
        <Song 
          removeSongFromQueueOrPlaylist={this.removeSongFromQueueOrPlaylist}
          addSongToQueueOrPlaylist={this.addSongToQueueOrPlaylist}
          addSongToQueue={this.addSongToQueue} 
          addSongToPlaylist={this.addSongToPlaylist} 
          data={this.state.playlist.songs[key]} 
          type="qupplist"
          colour="grey"
          key={key}
        />
      );
    } else {
      playlistContent = "No songs in playlist, search to add some!";
    }
    
    if (this.state.playlist.hasOwnProperty('queue') && Object.keys(this.state.playlist.queue).length > 0){
      queueContent = 
      Object
      .keys(this.state.playlist.queue)
      .map(key => 
        <Song 
          removeSongFromQueueOrPlaylist={this.removeSongFromQueueOrPlaylist}
          addSongToQueueOrPlaylist={this.addSongToQueueOrPlaylist}
          data={this.state.playlist.queue[key]} 
          type="queue"
          colour="grey"
          key={key}
        />
      );
    } else {
       queueContent = "No songs in queue, search to add some!";
    }

    if (!isEmpty(this.props.playlists.playlist)) {
      playlistName = this.props.playlists.playlist[0].name;;
    }
    const nowPlaying = this.state.nowPlaying;
    const upNext = this.state.upNext;
    return (
        
        <Fragment>
          <MyProvider value={{nowPlaying, upNext}}>
            <Header 
              songs={(this.state.playlist.songs === undefined) ? 0 : this.state.playlist.songs.length} 
              username={this.props.auth.user.name} 
              playlistname={playlistName} 
              upNext="Walking home through the park - Aim"
            />
          </MyProvider>

          <div className="container">
            <Button onClick={this.playClickHandler} className="m-2">Play ►</Button>
            <Row className="flex flex-wrap md:block flex-col-reverse">
              <Col s={12} m={10} l={6} xl={4} offset="m1 xl2">
                <h1 className="text-blue darken-1">qupplist</h1>
                {playlistContent}
              </Col>
              <Col className="" s={12} m={10} l={6} xl={4} offset="m1">
                <h1>search</h1>
                <SearchForm addSearchResultsToState={this.addSearchResultsToState} />
                <Button className="yellow darken-1 text-black font-bold" onClick={() => {this.setState({searchResults: []})}}>Clear</Button>
                {Object
                  .keys(this.state.searchResults)
                  .map(key => 
                    <Song 
                      addSongToQueueOrPlaylist={this.addSongToQueueOrPlaylist}
                      addSongToQueue={this.addSongToQueue} 
                      addSongToPlaylist={this.addSongToPlaylist} 
                      type="search"
                      data={this.state.searchResults[key]} 
                      key={key}
                    />
                  )
                }
                <h1 className="text-yellow darken-1">queue</h1>
                {queueContent}
              </Col>
            </Row>
          </div>
        </Fragment>
    )
  }
}

QuppListPage.propTypes = {
  getPlaylist: PropTypes.func.isRequired,
  clearPlaylists: PropTypes.func.isRequired,
	playlist: PropTypes.object,
	auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	playlists: state.playlist
});

export default connect(mapStateToProps, { getPlaylist, clearPlaylists })(QuppListPage);