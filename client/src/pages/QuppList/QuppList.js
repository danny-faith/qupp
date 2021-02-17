import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import base from '../../base'
import firebaseApp from '../../base'
import PropTypes from 'prop-types'
import { getPlaylist, clearPlaylists } from '../../actions/playlistActions'
import isEmpty from '../../utils/isEmpty'

import { Row, Col, Button } from 'react-materialize'

import SearchForm from '../../components/playlist/SearchForm'
import Header from '../../components/playlist/Header'
import SongList from './SongList'

import {
    getUpNextSong,
    getNowPlayingSong,
    addSongToQupplist,
    addToQueue,
} from './services/player'

import { remove, view } from 'ramda'
import * as R from 'ramda'

class QuppListPage extends Component {
    constructor(props) {
        super(props)
        this.firebaseSyncFlag = true
    }

    state = { 
        playlist: {
            qupplist: [],
            queue: [],
        },
        playing: false,
        progress: 0,
        nowPlaying: {},
        upNext: {},
        searchResults: [],
    }

    componentDidMount = () => {
        const firebaseToken = localStorage.getItem('firebaseToken')

        if (firebaseToken === null) {
            return window.M.toast({
                html: 'There was an error loading the page, please refresh',
                classes: 'red lighten-2'
            }) 
        }

        firebaseApp.initializedApp
            .auth()
            .signInWithCustomToken(firebaseToken)
            .then((user) => {
            })
            .catch((error) => {
                var errorCode = error.code
                var errorMessage = error.message
                console.log(`Error: ${errorCode} ${errorMessage}`)
        })

        this.props.clearPlaylists()
        this.props.getPlaylist(this.props.match.params.slug)    
    }

    componentDidUpdate = () => {
        const playlistsAreThereAndFirebaseIsSynced = (
            !isEmpty(this.props.playlists.playlist) && this.firebaseSyncFlag === true
        )

        if (playlistsAreThereAndFirebaseIsSynced) {
            const { _id: id } = this.props.playlists.playlist
            base.syncState(`playlists/${id}`, {
                context: this,
                state: 'playlist',
            })
            this.firebaseSyncFlag = false
        }
    }

    componentWillUnmount = () => {
        // prevent memeory leak from setInterval()
        clearInterval(this.progress)
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
                clearInterval(this.progress)
            } else {
                this.playSong()
                // if (this.state.playlist.queue.length > 1) {
                //     this.populateUpNext()
                // }
            }
        })    
    }
  
    playSong2 = async () => {
        const { duration_ms } = this.state.nowPlaying
        const duration_secs = duration_ms / 1000

        let secondsPassed = Math.round((duration_secs / 100)  * this.state.progress)
        return new Promise(resolve => {
            this.progress = setInterval(() => {
                const percent = Math.round((secondsPassed / duration_secs) * 100)
                this.setState({progress: percent})
                if (percent >= 100) {
                    clearInterval(this.progress)
                    // this.removeFirstSongFromQueueHandler()
                    if (this.state.playlist.queue) {
                        // this.playNextSong()
                        resolve('resolved')
                    }
                }
                secondsPassed ++
            }, 10)
          })
    }

    playSong = () => {
        const { duration_ms } = this.state.nowPlaying
        const duration_secs = duration_ms / 1000

        let secondsPassed = Math.round((duration_secs / 100)  * this.state.progress)
        // to stop, just set secondsPassed back to 0
        //  NOTE: not a great way of calucationg when a song is finished and percentage of song passed due to setInterval not being accurate (event loop)
        this.progress = setInterval(() => {
            const percent = Math.round((secondsPassed / duration_secs) * 100)
            this.setState({progress: percent})
            if (percent >= 100) {
                clearInterval(this.progress)
                // this.removeFirstSongFromQueueHandler()
                if (!isEmpty(this.state.playlist.queue)) {
                    this.playNextSong()
                }
            }
            secondsPassed ++
        }, 10)
    }

    playNextSong = () => {
        const copyOfState = {...this.state}
        const { queue } = copyOfState.playlist
        copyOfState.progress = 0
        copyOfState.playlist.queue = queue.slice(1)

        if (this.state.playlist.queue.length === 0) {
            copyOfState.nowPlaying = {}
            copyOfState.upNext = {}
            window.M.toast({html: 'No more songs to play, please queue some', classes: 'red lighten-2'})
        }
        if (this.state.playlist.queue.length >= 0) {
            copyOfState.nowPlaying = this.state.playlist.queue[0]
            copyOfState.upNext = {}
        }
        if (this.state.playlist.queue.length > 1) {
            copyOfState.upNext = this.state.playlist.queue[1]
        }
        this.setState(copyOfState, () => {
            if (!isEmpty(this.state.playlist.queue)) {
                this.playSong()
            }
        })
    }

    // playNextSong = () => {
    //     // Remove first song from queue
    //     const copyOfPlaylist = {...this.state.playlist}
    //     copyOfPlaylist.queue.shift()
    //     this.setState({
    //         playlist: copyOfPlaylist,
    //         progress: 0,
    //     }, () => {
    //         if (this.state.playlist.queue.length === 0) {
    //             this.setState({
    //                 nowPlaying: {},
    //                 upNext: {}
    //             })
    //             return window.M.toast({html: 'No more songs to play, please queue some', classes: 'red lighten-2'})
    //         }
    //         if (this.state.playlist.queue.length > 1) {
    //             this.populateUpNext()
    //         } else {        
    //             this.setState({ upNext: {} })
    //         }
    //         if (this.state.playlist.queue.length > 0) {
    //             this.populateNowPlaying(true)
    //         }
    //     })
    // }

    componentWillUpdate = (stuff) => {
        // TODO - FOR TESTING. CHECK HOW MANY TIMES `componentWillUpdate` runs
        if (this.state.playing && isEmpty(this.state.playlist.queue)) {
            this.setState({ playing: false })
        }
    }

    removeFirstSongFromQueueHandler = () => {
        const removeFirstSong = remove(1, 1)

        this.setState({
            playlist: {
                queue: removeFirstSong(this.state.playlist.queue)
            }
        })
    }

    // populateNowPlaying = () => {
    //     const nowPlaying = getNowPlayingSong(this.state)
    //     this.setState({ nowPlaying })
    // }

    // populateUpNext = () => {
    //     const upNext = getUpNextSong(this.state)
    //     this.setState({ upNext })
    // }

    addSearchResultsToState = (results) => {
        this.setState(() => ({ searchResults: results }))
    }

    addAllToQueueHandler = () => {
        this.addSongToQueueOrQupplistHandler(this.state.playlist.qupplist, 'queue')
    }

    addSongToQueueOrQupplistHandler = (songPayload, type) => {
        const {
            qupplist = [],
            queue = [],
        } = this.state.playlist
        const isQupplistAndNotEmpty = type === 'qupplist' && !isEmpty(this.state.playlist.qupplist)

        // put this checking of qupplist in an error handling file
        // also add any error handling to this file. See below
        if (isQupplistAndNotEmpty) {
            const found = qupplist.find((x) => x.spotId === songPayload.spotId)
            if (found) {
                return window.M.toast({
                    html: `"${songPayload.name}" is a duplicate, cannot add`,
                    classes: 'red lighten-2'
                })
            }
        }

        let newPlaylist
        const copyOfState = R.clone(this.state)
        
        if (type === 'qupplist') {
            newPlaylist = addSongToQupplist(songPayload, qupplist)
        } else if (type === 'queue') {
            newPlaylist = addToQueue(songPayload, queue)
        }
        copyOfState.playlist[type] = newPlaylist

        
        if (type === 'queue') {
            if (copyOfState.playlist.queue.length <= 1) {
                copyOfState.nowPlaying = getNowPlayingSong(copyOfState)
            }
            if (copyOfState.playlist.queue.length > 1) {
                copyOfState.upNext = getUpNextSong(copyOfState)
            }
        }

        this.setState(copyOfState, () => {
            // if array then multple songs have been added to queue
            if (Array.isArray(songPayload)) {
                songPayload.map(item => window.M.toast({html: `${item.name}, ${item.album} added`, classes: 'green lighten-2'}))
            } else {
                window.M.toast({html: `${songPayload.name}, ${songPayload.album} added`, classes: 'green lighten-2'})
            }
        })
    }

    removeSongFromQueueOrPlaylist = (index, type) => {
        const playlistLens = R.lensPath([
            ['state'],
            ['playlist'],
            type
        ])
        const chosenPlaylist = view(playlistLens, this)
        const removeSongAtIndex = remove(index, 1)

        this.setState({
            playlist: {
                [type]: removeSongAtIndex(chosenPlaylist),
            }
        })
    }

    clearSearchResults = () => {
        this.setState({
            searchResults: [],
        })
    }

    render() {
        console.log('QuppList render');
        let playlistName = ''
        const {
            searchResults,
            playlist: {
                qupplist = [],
                queue = [],
            },
        } = this.state

        if (!isEmpty(this.props.playlists.playlist)) {
            playlistName = this.props.playlists.playlist.name
        }
        const playDisabled = (isEmpty(this.state.playlist.queue)) ? true : false
        const playButton = (this.state.playing) 
            ? <Button onClick={this.playClickHandler} disabled={playDisabled} className="m-2 red">Stop ■</Button>
            : <Button onClick={this.playClickHandler} disabled={playDisabled} className="m-2">Play ►</Button>
        const nowPlaying = (this.state.playlist.queue) ? this.state.playlist.queue[0] : {}
        const upNext = (this.state.playlist.queue) ? this.state.playlist.queue[1] : {}

        return (
            <Fragment>
                <Header 
                    numberOfSongsInQupplist={(this.state.playlist.qupplist === undefined) ? 0 : this.state.playlist.qupplist.length} 
                    username={this.props.auth.user.name} 
                    playlistname={playlistName} 
                    nowPlaying={nowPlaying} 
                    upNext={upNext} 
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
                                addSongToQueueOrQupplistHandler={this.addSongToQueueOrQupplistHandler}
                                colour="grey"
                            />
                        </Col>

                        <Col s={12} m={10} l={6} xl={4} offset="m1">
                            <h1>search</h1>
                            <SearchForm addSearchResultsToState={this.addSearchResultsToState} />
                            <Button
                                className="white darken-1 text-black font-bold"
                                onClick={this.clearSearchResults}
                            >
                                Clear search results
                            </Button>
                            <SongList
                                songs={searchResults}
                                type="search"
                                addSongToQueueOrQupplistHandler={this.addSongToQueueOrQupplistHandler}
                            />
                            <h1 className="text-yellow darken-1">queue</h1>
                            <div className="queue-list">
                                <SongList
                                    songs={queue}
                                    type="queue"
                                    removeSongFromQueueOrPlaylist={this.removeSongFromQueueOrPlaylist}
                                    addSongToQueueOrQupplistHandler={this.addSongToQueueOrQupplistHandler}
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
})

export default connect(mapStateToProps, { getPlaylist, clearPlaylists })(QuppListPage)