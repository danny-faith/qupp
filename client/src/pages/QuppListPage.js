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
      name: 'Gabriel',
      artists: ['Joe Goddard', 'Valentina'],
      album: 'Gabriel',
      duration_ms: 3000 ,
      spotId: '1VpQNXHEd6fKIC3wrz2LoF'
    },
    upNext: {},
    searchResults: []
  }
  state = { 
    playlist: {
      songs: [],
      queue: [],
    },
    nowPlaying: {
      name: 'Gabriel',
      artists: ['Joe Goddard', 'Valentina'],
      album: 'Gabriel',
      duration_ms: 3000 ,
      spotId: '1VpQNXHEd6fKIC3wrz2LoF'
    },
    upNext: {},
    searchResults: []
  }
  componentDidMount = () => {
    base.syncState(`playlists/${this.props.match.params.playlist_id}`, {
      context: this,
      state: 'playlist'
    });
    this.props.clearPlaylists();
    this.props.getPlaylist(this.props.match.params.playlist_id);    
  }
  addSearchResultsToState = (results) => {
    this.setState(() => ({
      searchResults: results
    }));
  }
  addSongToQueueOrPlaylist = (songToAdd, type) => {

    const playlist = {...this.state.playlist};

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

    return (
        
        <Fragment>
          <MyProvider value={this.state.nowPlaying}>
            <Header 
              songs={(this.state.playlist.songs === undefined) ? 0 : this.state.playlist.songs.length} 
              username={this.props.auth.user.name} 
              playlistname={playlistName} 
              upNext="Walking home through the park - Aim"
            />
          </MyProvider>

          <div className="container">
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