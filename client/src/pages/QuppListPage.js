import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import base from '../base';
import PropTypes from 'prop-types';
import { getPlaylist } from '../actions/playlistActions';

import { Row, Col } from 'react-materialize';

import SearchForm from '../components/SearchForm';
import Header from '../components/common/Header';
import Song from '../components/playlist/Song';


class QuppListPage extends Component {
  state = { 
    playlist: {
      songs: {},
      queue: {},
    },
    searchResults: []
  }
  componentDidMount = () => {
    base.syncState(`playlists/${this.props.match.params.playlist_id}`, {
      context: this,
      state: 'playlist'
    });
  }
  addSearchResultsToState = (results) => {
    this.setState(() => ({
      searchResults: results
    }));
  }
  addSongToPlaylist = (songToAdd) => {
    // Copy playlist state
    const playlist = {...this.state.playlist};
    if (this.state.playlist.hasOwnProperty('songs')) {
      playlist.songs[songToAdd.spotId] = songToAdd;
    } else {
      playlist.songs = [];
      playlist.songs[songToAdd.spotId] = songToAdd;
    }
    playlist.songs[songToAdd.spotId] = songToAdd;
    this.setState({
      playlist
    });
  }
  addSongToQueue = (songToAdd) => {
    // Copy playlist state
    
    const playlist = {...this.state.playlist};
    console.log(playlist);
    if (this.state.playlist.hasOwnProperty('queue')) {
      playlist.queue[songToAdd.spotId] = songToAdd;
    } else {
      playlist.queue = [];
      playlist.queue[songToAdd.spotId] = songToAdd;
    }
    // playlist.queue[songToAdd.spotId] = songToAdd;
    this.setState({
      playlist
    });
  }
  render() {
    let playlistContent = '';
    // wonder if isEmpty would work below?
    if (this.state.playlist.hasOwnProperty('songs') && Object.keys(this.state.playlist.songs).length > 0){
      playlistContent = 
      Object
      .keys(this.state.playlist.songs)
      .map(key => 
        <Song 
          addSongToQueue={this.addSongToQueue} 
          addSongToPlaylist={this.addSongToPlaylist} 
          data={this.state.playlist.songs[key]} 
          colour="grey"
          key={key}
        />
      );
    } else {
       playlistContent = "No songs in playlist, search to add some!";
    }
    let queueContent = '';
    
    if (this.state.playlist.hasOwnProperty('queue') && Object.keys(this.state.playlist.queue).length > 0){
      queueContent = 
      Object
      .keys(this.state.playlist.queue)
      .map(key => 
        <Song 
          addSongToQueue={this.addSongToQueue} 
          addSongToPlaylist={this.addSongToPlaylist} 
          data={this.state.playlist.queue[key]} 
          colour="grey"
          key={key}
        />
      );
    } else {
       queueContent = "No songs in queue, search to add some!";
    }
    return (
        <Fragment>
          <Header songs={25} username={this.props.auth.user.name} playlistname={'ggg'} />
          <div className="container">
            <Row>
              <Col s={12} m={6}>
                <h1>qupplist</h1>
                {playlistContent}
                {/* <Song colour="green" />
                <Song colour="green" />
                <Song colour="green" />
                <Song colour="green" />
                <Song colour="green" />
                <Song colour="green" />
                <Song colour="green" />
                <Song colour="green" />
                <Song colour="green" />
                <Song colour="green" /> */}
              </Col>
              <Col s={12} m={6}>
                <h1>queue</h1>
                {queueContent}
                {/* <Song colour="yellow" />
                <Song colour="yellow" />
                <Song colour="yellow" />
                <Song colour="grey" />
                <Song colour="grey" /> */}

                <h1>search</h1>
                <SearchForm addSearchResultsToState={this.addSearchResultsToState} />
                {Object
                  .keys(this.state.searchResults)
                  .map(key => 
                    <Song 
                      addSongToQueue={this.addSongToQueue} 
                      addSongToPlaylist={this.addSongToPlaylist} 
                      data={this.state.searchResults[key]} 
                      key={key}
                    />
                  )}
              </Col>
            </Row>
          </div>
        </Fragment>
    )
  }
}

QuppListPage.propTypes = {
  getPlaylist: PropTypes.func.isRequired,
	playlist: PropTypes.object,
	auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	playlists: state.playlist
});

export default connect(mapStateToProps, { getPlaylist })(QuppListPage);