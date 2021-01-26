import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import base from '../../base';
import firebaseApp from '../../base';
import PropTypes from 'prop-types';
import { getPlaylist, clearPlaylists } from '../../actions/playlistActions';
import isEmpty from '../../utils/isEmpty';

import { Row, Col, Button } from 'react-materialize';

import SearchForm from '../../components/playlist/SearchForm';
import Header from '../../components/layout/Header';
import SongList from './SongList';

import { populateNowPlaying } from './services/player'

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
        searchResults: [],
    }

    componentDidMount = () => {
        const firebaseToken = localStorage.getItem('firebaseToken')

        firebaseApp.initializedApp
            .auth()
            .signInWithCustomToken(firebaseToken)
            .then((user) => {
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
        })

        this.props.clearPlaylists();
        this.props.getPlaylist(this.props.match.params.slug);    
    }

    syncToFirebase = () => {
        
    }

    componentDidUpdate = () => {
        const havePlaylistsAndFirebaseIsSynced = (
            !isEmpty(this.props.playlists.playlist) && this.state.firebaseSyncFlag === true
        )
        if (havePlaylistsAndFirebaseIsSynced) {
            // sync to users speicific playlist 
            // TODO move syncState into `firebaseApp.initializedApp` then()
            base.syncState(`playlists/${this.props.playlists.playlist[0]._id}`, {
                context: this,
                state: 'playlist',
                then() {
                    if (!isEmpty(this.state.playlist.queue)) {
                        this.populateNowPlaying();
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
        // already have data in list
        /**
         * 1. Play nowPlaying song
         * 2. Once complete check for more songs
         * 3. if more songs then play next song
         * 4. if no more songs, stop playing
         */

        // const copyOfState = {...this.state}
        // copyOfState.playing = !this.state.playing
        // this.setState(copyOfState, async () => {
        //     await this.playSong2()
        //     if ()
        // })

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
  
    playSong2 = async () => {
        const { duration_ms } = this.state.nowPlaying;
        const duration_secs = duration_ms / 1000;

        let secondsPassed = Math.round((duration_secs / 100)  * this.state.progress);
        return new Promise(resolve => {
            this.progress = setInterval(() => {
                const percent = Math.round((secondsPassed / duration_secs) * 100);
                this.setState({progress: percent});
                if (percent >= 100) {
                    clearInterval(this.progress);
                    // this.removeFirstSongFromQueue()
                    if (this.state.playlist.queue) {
                        // this.playNextSong();
                        resolve('resolved');
                    }
                }
                secondsPassed ++;
            }, 10);
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
                // this.removeFirstSongFromQueue()
                if (this.state.playlist.queue) {
                    this.playNextSong();
                }
            }
            secondsPassed ++;
        }, 10);
    }

    removeFirstSongFromQueue = () => {
        const copyOfState = {...this.state}
        console.log('removeFirstSongFromQueue state', this.state.playlist);
        if (copyOfState.playlist.queue.length > 0) {
            const { queue } = copyOfState.playlist
            console.log('removeFirstSongFromQueue > 0', this.state.playlist.queue.length);
            copyOfState.playlist.queue = queue.slice(1);
            this.setState(copyOfState)
        }
    }

    playNextSong = () => {
        const copyOfState = {...this.state};
        const { queue } = copyOfState.playlist
        copyOfState.progress = 0
        copyOfState.playlist.queue = queue.slice(1);

        if (this.state.playlist.queue.length === 0) {
            copyOfState.nowPlaying = {}
            copyOfState.upNext = {}
            window.M.toast({html: 'No more songs to play, please queue some', classes: 'red lighten-2'});
        }
        if (this.state.playlist.queue.length >= 0) {
            copyOfState.nowPlaying = this.state.playlist.queue[0]
            copyOfState.upNext = {}
        }
        if (this.state.playlist.queue.length > 1) {
            copyOfState.upNext = this.state.playlist.queue[1]
        }
        this.setState(copyOfState, () => {
            this.playSong()
        })
    }

    // playNextSong = () => {
    //     // Remove first song from queue
    //     const copyOfPlaylist = {...this.state.playlist};
    //     copyOfPlaylist.queue.shift();
    //     this.setState({
    //         playlist: copyOfPlaylist,
    //         progress: 0,
    //     }, () => {
    //         if (this.state.playlist.queue.length === 0) {
    //             this.setState({
    //                 nowPlaying: {},
    //                 upNext: {}
    //             });
    //             return window.M.toast({html: 'No more songs to play, please queue some', classes: 'red lighten-2'});
    //         }
    //         if (this.state.playlist.queue.length > 1) {
    //             this.populateUpNext();
    //         } else {        
    //             this.setState({ upNext: {} });
    //         }
    //         if (this.state.playlist.queue.length > 0) {
    //             this.populateNowPlaying(true);
    //         }
    //     });
    // }

    componentWillUpdate = (stuff) => {
        // TODO - FOR TESTING. CHECK HOW MANY TIMES `componentWillUpdate` runs
        if (this.state.playing && isEmpty(this.state.playlist.queue)) {
            this.setState({ playing: false });
        }
    }

    populateNowPlaying = () => {
        let nowPlaying = {...this.state.nowPlaying};
        nowPlaying = this.state.playlist.queue[0];
        this.setState({nowPlaying});
    }

    populateUpNext = () => {
        console.log('populating upNext')    
        let upNext = {...this.state.upNext};
        console.log('this.state.playlist.queue[1]: ', this.state.playlist.queue[1])
        upNext = this.state.playlist.queue[1];
        this.setState({upNext});
    }

    addSearchResultsToState = (results) => {
        this.setState(() => ({ searchResults: results }));
    }

    addAllToQueueHandler = () => {
        this.addSongToQueueOrPlaylist(this.state.playlist.qupplist, 'queue');
    }

    addSongToQueueOrPlaylist = (songPayload, type) => {
        const errors = {};
        let playlist = {...this.state.playlist};

        // Check to see if song being added to qupplist is already there
        if (type === 'qupplist' && !isEmpty(playlist.qupplist)) {
            const found = playlist.qupplist.find((x) => x.spotId === songPayload.spotId)
            if (found) {
                errors.addSong = `"${songPayload.name}" is a duplicate, cannot add`;
            }
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
            console.log('type:', type);
            // check where we're adding song to exists, if it doesn't then ...
            if (this.state.playlist.hasOwnProperty(type)) {
                // if queue has more than one entry, add songPayload to second([1]) place in 
                if (type === 'queue' && this.state.playlist.queue.length > 0) {
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

        this.setState({ playlist }, () => {
            if (type === 'queue') {
                this.populateNowPlaying();
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
            if (this.state.playlist.queue.length < 2) {
                copyOfPlaylist.upNext = {};
                if (isEmpty(this.state.playlist.queue)) {
                    copyOfPlaylist.nowPlaying = {};
                }
            }
        }

        this.setState({ playlist: copyOfPlaylist });
    }

  render() {
    let playlistName = '';
    const {
        searchResults,
        playlist: {
            qupplist = [],
            queue = [],
        },
    } = this.state

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
          <Header 
            numberOfSongsInQupplist={(this.state.playlist.qupplist === undefined) ? 0 : this.state.playlist.qupplist.length} 
            username={this.props.auth.user.name} 
            playlistname={playlistName} 
            nowPlaying={this.state.nowPlaying} 
            upNext={this.state.upNext} 
            progressValue={this.state.progress}
          />

          <div className="container">
            {playButton}
            <Row className="flex flex-wrap md:block flex-col-reverse">
              <Col s={12} m={10} l={6} xl={4} offset="m1 xl2">
                <h1 className="text-blue darken-1">qupplist
                  <Button onClick={this.addAllToQueueHandler} className="yellow text-black font-bold ml-4">Add all to queue</Button>
                </h1>
                <SongList
                    songs={qupplist}
                    type="qupplist"
                    removeSongFromQueueOrPlaylist={this.removeSongFromQueueOrPlaylist}
                    addSongToQueueOrPlaylist={this.addSongToQueueOrPlaylist}
                    colour="grey"
                />
              </Col>
              <Col s={12} m={10} l={6} xl={4} offset="m1">
                <h1>search</h1>
                <SearchForm addSearchResultsToState={this.addSearchResultsToState} />
                <Button className="white darken-1 text-black font-bold" onClick={() => {this.setState({searchResults: []})}}>Clear search results</Button>
                <SongList
                    songs={searchResults}
                    type="search"
                    addSongToQueueOrPlaylist={this.addSongToQueueOrPlaylist}
                />
                <h1 className="text-yellow darken-1">queue</h1>
                <div className="queue-list">
                    <SongList
                        songs={queue}
                        type="queue"
                        removeSongFromQueueOrPlaylist={this.removeSongFromQueueOrPlaylist}
                        addSongToQueueOrPlaylist={this.addSongToQueueOrPlaylist}
                        colour="grey"
                    />
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