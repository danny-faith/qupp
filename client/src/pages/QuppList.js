import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import base from '../base';
import firebaseApp from '../base';
import PropTypes from 'prop-types';
import { getPlaylist, clearPlaylists } from '../actions/playlistActions';
import isEmpty from '../utils/isEmpty';

import { Row, Col, Button } from 'react-materialize';

import SearchForm from '../components/playlist/SearchForm';
import Header from '../components/layout/Header';
import Song from '../components/playlist/Song';

require('dotenv').config();

const { 
  REACT_APP_FIREBASE_EMAIL,
  REACT_APP_FIREBASE_PASSWORD
} = process.env;
class QuppListPage extends Component {
  state = { 
    playlist: {
      qupplist: [],
      queue: [],
    },
    firebaseSyncFlag: true,
    playing: false,
    progress: 0,
    nowPlaying: {},
    upNext: {},
    searchResults: []
  }
  componentDidMount = () => {
    firebaseApp.initializedApp.auth().signInWithEmailAndPassword(REACT_APP_FIREBASE_EMAIL, REACT_APP_FIREBASE_PASSWORD).catch(function(error) {
        // Handle Errors here.
        window.M.toast({html: `${error.code} ${error.message}`, classes: 'red lighten-2'})
    });
    
    this.props.clearPlaylists();
    this.props.getPlaylist(this.props.match.params.slug);    
  }
  componentDidUpdate = () => {
    if (!isEmpty(this.props.playlists.playlist) && this.state.firebaseSyncFlag === true) {
      // sync to users speicific playlist 
      // TODO move syncState into `firebaseApp.initializedApp` then()
      base.syncState(`playlists/${this.props.playlists.playlist[0]._id}`, {
        context: this,
        state: 'playlist',
        then() {
          if (!isEmpty(this.state.playlist.queue)) {
            this.populateNowPlaying(false);
          }
          if (this.state.playlist.hasOwnProperty('queue')) {
            if (this.state.playlist.queue.length > 1) {
              this.populateUpNext();
            }
          }
        }
      });
      let firebaseSyncFlag = {...this.state.firebaseSyncFlag};
      firebaseSyncFlag = false;
      this.setState({firebaseSyncFlag});
    }
  }
  componentWillUnmount = () => {
    // prevent memeory leak from setInterval()
    clearInterval(this.progress);
  }
  playClickHandler = () => {
    
    this.setState((prevState) => ({
      playing: !prevState.playing
    }), () => {
      if (this.state.playing === false) {
        // If player has just been stopped, stop / clear timeout
        clearInterval(this.progress);
      } else {
        this.playSong();
        if (this.state.playlist.queue.length > 1) {
          this.populateUpNext();
        }
      }
    });    
  }
  playSong = () => {
    const { duration_ms } = this.state.nowPlaying;
    const duration_secs = duration_ms / 1000;

    let secondsPassed = Math.round((duration_secs / 100)  * this.state.progress);
    // to stop, just set secondsPassed back to 0
    //  NOTE: not a great way of calucationg when a song is finished and percentage of song passed due to setInterval not being accurate (event loop)
    this.progress = setInterval(() => {
      const percent = Math.round((secondsPassed / duration_secs) * 100);
      this.setState({progress: percent});
      if (percent >= 100) {
        clearInterval(this.progress);
        this.playNextSong();
      }
      secondsPassed ++;
    }, 1000);

  }
  playNextSong = () => {
    // Remove first song from queue
    const copyOfPlaylist = {...this.state.playlist};
    copyOfPlaylist.queue.shift();
    this.setState({playlist: copyOfPlaylist}, () => {
      if (this.state.playlist.queue.length === 0) {
        this.setState({
          nowPlaying: {},
          upNext: {}
        });
        return window.M.toast({html: 'No more songs to play, please queue some', classes: 'red lighten-2'});
      }
      if (this.state.playlist.queue.length > 1) {
        this.populateUpNext();
      } else {        
        this.setState({
          upNext: {}
        });
      }
      if (this.state.playlist.queue.length > 0) {
        this.populateNowPlaying(true);
      }
    });
  }
  componentWillUpdate = (stuff) => {
    // TODO - FOR TESTING. CHECK HOW MANY TIMES `componentWillUpdate` runs
    if (this.state.playing && this.state.playlist.queue.length === 0) {
      this.setState({playing: false});
    }
  }
  populateNowPlaying = (play) => {
    let nowPlaying = {...this.state.nowPlaying};
    nowPlaying = this.state.playlist.queue[0];
    const playBool = (play) ? this.playSong : null;
    this.setState({nowPlaying}, playBool);
  }
  populateUpNext = () => {
    console.log('populating upNext')    
    let upNext = {...this.state.upNext};
    console.log('this.state.playlist.queue[1]: ', this.state.playlist.queue[1])
    upNext = this.state.playlist.queue[1];
    this.setState({upNext});
  }
  addSearchResultsToState = (results) => {
    this.setState(() => ({
      searchResults: results
    }));
  }
  addAllToQueueHandler = () => {
    this.addSongToQueueOrPlaylist(this.state.playlist.qupplist, 'queue');
  }
  addSongToQueueOrPlaylist = (songPayload, type) => {
    const errors = {};
    let playlist = {...this.state.playlist};
    
    // Check to see if song being added to qupplist is already there
    if (type === 'qupplist' && !isEmpty(playlist.qupplist)) {
      Object.keys(playlist.qupplist).forEach(key => {
        if (playlist.qupplist[key].spotId === songPayload.spotId) {
          errors.addSong = `"${songPayload.name}" is a duplicate, cannot add`;
        }
      });
    }
    
    if(!isEmpty(errors)) {
      return window.M.toast({html: errors.addSong, classes: 'red lighten-2'})
    }
    
    // Firebase removes empty arrays
    // so if playlist.queue || playlist.qupplist exists, add to it
    // else(because Firebase removed it) create an empty array of either `song` or `queue` (type) then add to it

    // if songPayload > 1 then we're adding all in qupplist to the queue
    if (songPayload.length > 1) {
      // if playlist.qupplist is empty due to Firebase then create empty array
      if (isEmpty(playlist.qupplist)) {
        playlist.qupplist = [];
      }
      if (isEmpty(playlist.queue)) {
        playlist.queue = [];
      }
      const newQueue = [...songPayload, ...playlist.queue];
      playlist.queue = newQueue;
    } else {
      // check where we're adding song to exists, if it doesn't then ...
      if (this.state.playlist.hasOwnProperty(type)) {
        // if queue has more than one entry, add songPayload to second([1]) place in 
        if (type === 'queue' & this.state.playlist.queue.length > 0) {
          playlist.queue.splice(1, 0, songPayload);
        } else {
          playlist[type].unshift(songPayload);
        }
      } else {
        //  ... create empty array there then add song to it
        playlist[type] = [];
        playlist[type].unshift(songPayload);
      }
    }
    
    this.setState({
      playlist
    }, () => {
      if (type === 'queue') {
        this.populateNowPlaying(false);
        console.log('populateNowPlaying')
        if (this.state.playlist.queue.length > 1) {
          console.log('populateUpNext')
          this.populateUpNext();
        }
      }
      // if array then multple songs have been added to queue
      if (Array.isArray(songPayload)) {
        songPayload.map(item => window.M.toast({html: `${item.name}, ${item.album} added`, classes: 'green lighten-2'}));
      } else {
        window.M.toast({html: `${songPayload.name}, ${songPayload.album} added`, classes: 'green lighten-2'});
      }
    });

  }
  removeSongFromQueueOrPlaylist = (songIdToRemove, type) => {
    
    const copyOfPlaylist = {...this.state.playlist};
    const index = copyOfPlaylist[type].findIndex(x => x.spotId === songIdToRemove);
    copyOfPlaylist[type].splice(index, 1);

    if (type === 'queue') {
      console.log('its a queue type change')
      if (this.state.playlist.queue.length < 2) {
        console.log('remove upNext')
        copyOfPlaylist.upNext = {};
        if (isEmpty(this.state.playlist.queue)) {
          console.log('remove nowPlaying')
          copyOfPlaylist.nowPlaying = {};
        }
      }
    }
    
    this.setState({
      playlist: copyOfPlaylist
    }, () => {
    });
  }
  render() {
    let playlistContent = '';
    let playlistName = '';
    let queueContent = '';
    // TODO wonder if isEmpty would work in if() below?
    if (this.state.playlist.hasOwnProperty('qupplist') && Object.keys(this.state.playlist.qupplist).length > 0) {
      playlistContent = 
      Object
      .keys(this.state.playlist.qupplist)
      .map(key => 
        <Song 
          removeSongFromQueueOrPlaylist={this.removeSongFromQueueOrPlaylist}
          addSongToQueueOrPlaylist={this.addSongToQueueOrPlaylist}
          addSongToQueue={this.addSongToQueue} 
          addSongToPlaylist={this.addSongToPlaylist} 
          data={this.state.playlist.qupplist[key]} 
          type="qupplist"
          colour="grey"
          key={key}
        />
      );
    } else {
      playlistContent = "No qupplist in playlist, search to add some!";
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
      queueContent = "No qupplist in queue, search to add some!";
    }

    if (!isEmpty(this.props.playlists.playlist)) {
      playlistName = this.props.playlists.playlist[0].name;;
    }
    // const nowPlaying = this.state.nowPlaying;
    // const upNext = this.state.upNext;
    // why not add checks to make sure nowPlaying and upNext both had sufficient values before passing them to context
    const playDisabled = (isEmpty(this.state.playlist.queue)) ? true : false;
    const playButton = (this.state.playing) 
      ? <Button onClick={this.playClickHandler} disabled={playDisabled} className="m-2 red">Stop ■</Button>
      : <Button onClick={this.playClickHandler} disabled={playDisabled} className="m-2">Play ►</Button>;

    return (
        
        <Fragment>
          {/* <MyProvider value={{nowPlaying, upNext}}> */}
          {/* Remove context and just prop drill :( */}
          <Header 
            numberOfSongsInQupplist={(this.state.playlist.qupplist === undefined) ? 0 : this.state.playlist.qupplist.length} 
            username={this.props.auth.user.name} 
            playlistname={playlistName} 
            nowPlayingName={this.state.nowPlaying.name} 
            nowPlayingAlbum={this.state.nowPlaying.album} 
            nowPlayingArtists={this.state.nowPlaying.artists}
            upNextName={this.state.upNext.name} 
            upNextAlbum={this.state.upNext.album} 
            upNextArtists={this.state.upNext.artists}
            progressValue={this.state.progress}
          />

          <div className="container">
            {playButton}
            <Row className="flex flex-wrap md:block flex-col-reverse">
              <Col s={12} m={10} l={6} xl={4} offset="m1 xl2">
                <h1 className="text-blue darken-1">qupplist
                  <Button onClick={this.addAllToQueueHandler} className="yellow text-black font-bold ml-4">Add all to queue</Button>
                </h1>
                {playlistContent}
              </Col>
              <Col className="" s={12} m={10} l={6} xl={4} offset="m1">
                <h1>search</h1>
                <SearchForm addSearchResultsToState={this.addSearchResultsToState} />
                <Button className="white darken-1 text-black font-bold" onClick={() => {this.setState({searchResults: []})}}>Clear search results</Button>
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
                <div className="queue-list">
                  {queueContent}
                </div>
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