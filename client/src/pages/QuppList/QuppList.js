import React, { useState, useEffect, Fragment, useCallback, useRef } from 'react'
import { connect } from 'react-redux'

import { firebase } from '../../base'
import PropTypes from 'prop-types'
import { getPlaylist, clearPlaylists } from '../../actions/playlistActions'
import isEmpty from '../../utils/isEmpty'
import useInterval from '../../utils/useInterval'

import { Row, Col, Button } from 'react-materialize'

import SearchForm from '../../components/playlist/SearchForm'
import Header from '../../components/playlist/Header'
import PlayButton from '../../components/player/PlayButton'
import SongList from './SongList'

import {
    getUpNextSong,
    getNowPlayingSong,
    addSongToQupplist,
    addToQueue,
} from './services/player'

import { remove, view } from 'ramda'
import * as R from 'ramda'

export function QuppListPage(props) {
    const db = firebase.database()
    const [playlist, setPlaylist] = useState({
        qupplist: [],
        queue: [],
    })
    let payload = React.useRef()
    const [loadingPlaylists, setLoadingPlaylists] = useState({status: true})
    const [playing, setPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [nowPlaying, setNowPlaying] = useState({})
    const [upNext, setUpNext] = useState({})
    const [searchResults, setSearchResults] = useState([])
    let progressInterval = undefined
    const progressInterval2 = useRef()

    useEffect(() => {
        // const firebaseToken = localStorage.getItem('firebaseToken')
    
        // if (firebaseToken === null) {
        //     return window.M.toast({
        //         html: 'There was an error loading the page, please refresh',
        //         classes: 'red lighten-2'
        //     }) 
        // }
    
        props.clearPlaylists()
        props.getPlaylist(props.match.params.slug)    
    }, [])

    // componentDidUpdate = () => {
    //     const playlistsAreThereAndFirebaseIsSynced = (
    //         !isEmpty(this.props.playlists.playlist) && this.firebaseSyncFlag === false
    //     )

    //     if (playlistsAreThereAndFirebaseIsSynced) {
    //         const { _id: id } = this.props.playlists.playlist

    //         // base.syncState(`playlists/${id}`, {
    //         //     context: this,
    //         //     state: 'playlist',
    //         //     then() {
    //         //         this.firebaseSyncFlag = true
    //         //     }
    //         // })
    //     }
    // }

    // useEffect(() => {
    //     console.log('clearInterval')
    //     return clearInterval(progressInterval2.current)
    // })

    const playClickHandler = () => {
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
        //     await this.PlaySong2()
        //     if ()
        // })
        setPlaying((prevState) => !prevState)
        // this.setState((prevState) => ({
        //     playing: !prevState.playing
        // }), () => {
        //     if (this.state.playing === false) {
        //         // If player has just been stopped, stop / clear timeout
        //         clearInterval(this.progress)
        //     } else {
        //         this.PlaySong()
        //         // if (this.state.playlist.queue?.length > 1) {
        //         //     this.populateUpNext()
        //         // }
        //     }
        // })    
    }

    // useEffect(() => {
    //     console.log('I RUN')
    //     if (playing === false) {
    //         // clearInterval(progressInterval2.current)
    //     } else {
    //         // PlaySong(playlist.queue[0].duration_ms)
    //     }
    // }, [playing, playlist.queue, progressInterval2.current])

    // useEffect(() => {
    //     // if (!isEmpty(playlist.queue)) {
    //     //     PlaySong()
    //     // }
    //     // console.log('playlist updated', playlist.queue)
    //     console.log('queue check useEffect', playlist.queue)
        
    // }, [playlist])

    useEffect(() => {
        console.log('props.playlists', props.playlists.playlist)
        if (props.playlists && props.playlists.playlist) {
            const playlistRef = db.ref(`playlists/${props.playlists.playlist._id}`)

            playlistRef.on("value", (snapshot) => {
                const snapShot = snapshot.val()
                console.log('everytime')

                if (snapShot) {
                    setPlaylist(snapShot)
                }
            })
                
            return () => playlistRef.off()

        }
    }, [db, props.playlists])

    // const PlaySong2 = async () => {
    //     const { duration_ms } = this.state.nowPlaying
    //     const duration_secs = duration_ms / 1000

    //     let secondsPassed = Math.round((duration_secs / 100)  * this.state.progress)
    //     return new Promise(resolve => {
    //         this.progress = setInterval(() => {
    //             const percent = Math.round((secondsPassed / duration_secs) * 100)
    //             this.setState({progress: percent})
    //             if (percent >= 100) {
    //                 clearInterval(this.progress)
    //                 // this.removeFirstSongFromQueueHandler()
    //                 if (this.state.playlist.queue) {
    //                     // this.playNextSong()
    //                     resolve('resolved')
    //                 }
    //             }
    //             secondsPassed ++
    //         }, 10)
    //       })
    // }

    const duration_ms = (playlist.queue?.length > 0) ? playlist.queue[0].duration_ms : 0
    // const { duration_ms } = playlist.queue[0]
    const duration_secs = duration_ms / 1000
    console.log('checking',{duration_secs}, {progress})
    let secondsPassed = Math.round((duration_secs / 100)  * progress)

    useInterval(() => {    
        // Your custom logic here    
        // const percent = Math.round((progress / duration_secs) * 100)
        const percent = Math.round((secondsPassed / duration_secs) * 100)
        console.log('interval triggered', {secondsPassed})
        setProgress(percent)
        if (percent >= 100) {
            setProgress(0)
            playNextSong()
        //     clearInterval(progressInterval2.current)
        //     if (!isEmpty(playlist.queue)) {
        //         console.log('playNextSong')
        //         playNextSong()
        //     }
        }
        secondsPassed ++
    }, playing ? 30 : null)

    useEffect(() => {
        if (!isEmpty(playlist.queue)) {
            setLoadingPlaylists({status: false})
        }
    }, [playlist])
    
    useEffect(() => {
        if (loadingPlaylists.status === false && isEmpty(playlist.queue)) {
            setNowPlaying({})
            setUpNext({})
            window.M.toast({html: 'No more songs to play, please queue some', classes: 'red lighten-2'})
        }
        if (playlist.queue?.length === 1) {
            setNowPlaying(playlist.queue[0])
            setUpNext({})
        }
        if (playlist.queue?.length > 1) {
            setNowPlaying(playlist.queue[0])
            setUpNext(playlist.queue[1])
        }
    }, [playlist, loadingPlaylists])

    function PlaySong (duration_ms) {
        // const { duration_ms } = nowPlaying
        // const progressInterval2 = useRef()
        const duration_secs = duration_ms / 1000
        console.log('PlaySong called')

        // let secondsPassed = Math.round((duration_secs / 100)  * progress)
        // to stop, just set secondsPassed back to 0
        //  NOTE: not a great way of calucationg when a song is finished and percentage of song passed due to setInterval not being accurate (event loop)
        
        // progressInterval2.current = setInterval(() => {
        //     console.log('new setInterval')
        //     const percent = Math.round((secondsPassed / duration_secs) * 100)
        //     setProgress(percent)
        //     if (percent >= 100) {
        //         clearInterval(progressInterval2.current)
        //         if (!isEmpty(playlist.queue)) {
        //             console.log('playNextSong')
        //             playNextSong()
        //         }
        //     }
        //     secondsPassed ++
        // }, 10)
    }
    
    const playNextSong = () => {
        // const copyOfState = {...this.state}
        const cloneOfQueue = R.clone(playlist.queue)
        const slicedQueue = R.remove(0, 1, cloneOfQueue)
        // console.log('playNextSong playing', slicedQueue)
        // debugger
        // console.log('playNextSong playing', [1,2,3,4,5,6,7,8,9,10], R.remove(0, 1, [1,2,3,4,5,6,7,8,9,10]))
        // console.log('playNextSong playing', R.slice(1, Infinity, playlist.queue.slice(1)))
        // const { queue } = copyOfState.playlist
        // copyOfState.progress = 0
        setProgress(0)
        console.log('playNextSong called')
        db.ref(`playlists/${props.playlists.playlist._id}/queue`).set(slicedQueue)
            .then(() => {
                
                PlaySong(playlist.queue[0].duration_ms)
            })
        // const cloneOfQueue2 = R.clone(playlist.queue)
        // const slicedQueue2 = R.remove(0, 1, cloneOfQueue2)
        // console.log('playNextSong playing', slicedQueue2)
        // debugger
        // setPlaylist({ ...playlist,
        //     queue: slicedQueue,
        // })
        // copyOfState.playlist.queue = playlist.queue.slice(1)
        
        // this.setState(copyOfState, () => {
            //     if (!isEmpty(this.state.playlist.queue)) {
        //         this.PlaySong()
        //     }
        // })
    }

    // playNextSong = () => {
        //     // Remove first song from queue
        //     const copyOfPlaylist = {...this.state.playlist}
    //     copyOfPlaylist.queue.shift()
    //     this.setState({
    //         playlist: copyOfPlaylist,
    //         progress: 0,
    //     }, () => {
    //         if (this.state.playlist.queue?.length === 0) {
    //             this.setState({
    //                 nowPlaying: {},
    //                 upNext: {}
    //             })
    //             return window.M.toast({html: 'No more songs to play, please queue some', classes: 'red lighten-2'})
    //         }
    //         if (this.state.playlist.queue?.length > 1) {
    //             this.populateUpNext()
    //         } else {        
    //             this.setState({ upNext: {} })
    //         }
    //         if (this.state.playlist.queue?.length > 0) {
    //             this.populateNowPlaying(true)
    //         }
    //     })
    // }

    function usePrevious(value) {
        const ref = React.useRef()
        useEffect(() => {
            ref.current = value
        })
        return ref.current
    }

    const previousQueue = usePrevious(playlist.queue)
    const previousQupplist = usePrevious(playlist.qupplist)

    const manageSongNotifications = (previousQueue, nextQueue) => {
        // console.log('checking', nextQueue, previousQueue)
        const moreThanOneSongAdded = (
            (nextQueue?.length || 0) - 
                (previousQueue?.length || 0)) > 1
        const songRemoved = (nextQueue?.length - previousQueue?.length) < 0
        const { type } = payload.current
        const { name, album } = payload.current.song

        if (!isEmpty(previousQueue) && !isEmpty(nextQueue) && R.not(R.equals(previousQueue, nextQueue))) {
            if (type === 'queue' && moreThanOneSongAdded) {
                const numberOfNewSongsAdded = nextQueue.length - previousQueue.length
                const songsAdded = R.slice(1, numberOfNewSongsAdded + 1, nextQueue)

                songsAdded.map(({ name, album }) => window.M.toast({html: `${name}, ${album} added to ${type}`, classes: 'green lighten-2'}))
            } else if (songRemoved) {
                window.M.toast({html: `${name}, ${album} deleted from ${type}`, classes: 'red lighten-2'})
            } else {
                window.M.toast({html: `${name}, ${album} added to ${type}`, classes: 'green lighten-2'})
            }
        }
    }

    useEffect(() => {
        if (playlist.queue && playlist.queue?.length > 0) {
            if (playlist.queue?.length > 1) {
                setUpNext(playlist.queue[1])
            }
            setNowPlaying(playlist.queue[0])
        }
    }, [playlist, previousQueue, previousQupplist])


    useEffect(() => {
        if (payload.current) {
            switch (payload.current.type) {
                case 'queue':
                    manageSongNotifications(previousQueue, playlist.queue)
                    break
                case 'qupplist':
                    manageSongNotifications(previousQupplist, playlist.qupplist)
                    break
                default:
                    break
            }
        }
    }, [playlist.queue, playlist.qupplist, previousQueue, previousQupplist])

    useEffect(() => {
        if (playing && isEmpty(playlist.queue)) {
            setPlaying(false)
        }
    }, [playing, playlist.queue])

    // useEffect(() => {
    //     if (!playing) {
    //         setPlaying(false)
    //     }
    // }, [playing])

    // componentWillUpdate = (stuff) => {
    //     // TODO - FOR TESTING. CHECK HOW MANY TIMES `componentWillUpdate` runs
    //     if (this.state.playing && isEmpty(this.state.playlist.queue)) {
    //         this.setState({ playing: false })
    //     }
    // }

    const removeFirstSongFromQueueHandler = () => {
        const removeFirstSong = remove(1, 1)

        setPlaylist({ ...playlist,
            queue: removeFirstSong(playlist.queue)
        })
        // this.setState({
        //     playlist: {
        //         queue: removeFirstSong(this.state.playlist.queue)
        //     }
        // })
    }

    // populateNowPlaying = () => {
    //     const nowPlaying = getNowPlayingSong(this.state)
    //     this.setState({ nowPlaying })
    // }

    // populateUpNext = () => {
    //     const upNext = getUpNextSong(this.state)
    //     this.setState({ upNext })
    // }

    const addSearchResultsToState = (results) => {
        setSearchResults(results)
        // this.setState(() => ({ searchResults: results }))
    }

    const addAllToQueueHandler = () => {
        addSongToQueueOrQupplistHandler(playlist.qupplist, 'queue')
    }

    const addSongToQueueOrQupplistHandler = (songPayload, type) => {
        const {
            qupplist = [],
            queue = [],
        } = playlist
        const isQupplistAndNotEmpty = type === 'qupplist' && !isEmpty(playlist.qupplist)
        console.log('addSong songPayload check', songPayload)
        payload.current = R.clone({
            type,
            song: songPayload,
        })
        console.log('addSong payload check', payload)
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
        // const copyOfState = R.clone(this.state)
        
        if (type === 'qupplist') {
            newPlaylist = addSongToQupplist(songPayload, qupplist)
        } else if (type === 'queue') {
            newPlaylist = addToQueue(songPayload, queue)
        }
        // setPlaylist({ ...playlist,
        //     [type]: newPlaylist,
        // })
        db.ref(`playlists/${props.playlists.playlist._id}/${type}`).set(newPlaylist)

        
        // if (type === 'queue') {
        //     if (copyOfState.playlist.queue?.length <= 1) {
        //         copyOfState.nowPlaying = getNowPlayingSong(copyOfState)
        //     }
        //     if (copyOfState.playlist.queue?.length > 1) {
        //         copyOfState.upNext = getUpNextSong(copyOfState)
        //     }
        // }

        // this.setState(copyOfState, () => {
        //     // if array then multple songs have been added to queue
        //     if (Array.isArray(songPayload)) {
        //         songPayload.map(item => window.M.toast({html: `${item.name}, ${item.album} added`, classes: 'green lighten-2'}))
        //     } else {
        //         window.M.toast({html: `${songPayload.name}, ${songPayload.album} added`, classes: 'green lighten-2'})
        //     }
        // })
    }

    const removeSongFromQueueOrPlaylist = (index, type) => {
        const playlistLens = R.lensPath([
            type
        ])
        const chosenPlaylist = view(playlistLens, playlist)
        const removeSongAtIndex = remove(index, 1)
        const song = R.slice(index, index + 1, chosenPlaylist)[0]
        console.log('removed song', song)
        payload.current = {
            type,
            song: song,
        }

        // setPlaylist({ ...playlist,
        //     [type]: removeSongAtIndex(chosenPlaylist),
        // })
        db.ref(`playlists/${props.playlists.playlist._id}/${type}`).set(removeSongAtIndex(chosenPlaylist))
        // this.setState({
        //     playlist: {
        //         [type]: removeSongAtIndex(chosenPlaylist),
        //     }
        // })
    }

    const clearSearchResults = () => {
        setSearchResults([])
        // this.setState({
        //     searchResults: [],
        // })
    }

    // console.log('QuppList render')
    let playlistName = ''
    // const {
    //     searchResults,
    //     playlist: {
    //         qupplist = [],
    //         queue = [],
    //     },
    // } = this.state

    if (!isEmpty(props.playlists.playlist)) {
        playlistName = props.playlists.playlist.name
    }
    const playDisabled = (isEmpty(playlist.queue)) ? true : false
    console.log('render QuppListPage')
    return (
        <Fragment>
            <Header 
                numberOfSongsInQueue={(playlist.queue === undefined) ? 0 : playlist.queue?.length} 
                username={props.auth.user.name} 
                playlistname={playlistName} 
                nowPlaying={nowPlaying} 
                upNext={upNext} 
                progressValue={progress}
            />

            <div className="container">
                <PlayButton
                    onClick={playClickHandler}
                    disabled={playDisabled}
                    playing={playing}
                >
                </PlayButton>
                <Row className="flex flex-wrap md:block flex-col-reverse">

                    <Col s={12} m={10} l={6} xl={4} offset="m1 xl2">
                        <h1 className="text-blue darken-1">qupplist
                            <Button onClick={addAllToQueueHandler} className="yellow text-black font-bold ml-4">Add all to queue</Button>
                        </h1>
                        <SongList
                            songs={playlist.qupplist}
                            type="qupplist"
                            removeSongFromQueueOrPlaylist={removeSongFromQueueOrPlaylist}
                            addSongToQueueOrQupplistHandler={addSongToQueueOrQupplistHandler}
                            colour="grey"
                        />
                    </Col>

                    <Col s={12} m={10} l={6} xl={4} offset="m1">
                        <h1>search</h1>
                        <SearchForm addSearchResultsToState={addSearchResultsToState} />
                        <Button
                            className="white darken-1 text-black font-bold"
                            onClick={clearSearchResults}
                        >
                            Clear search results
                        </Button>
                        <SongList
                            songs={searchResults}
                            type="search"
                            addSongToQueueOrQupplistHandler={addSongToQueueOrQupplistHandler}
                        />
                        <h1 className="text-yellow darken-1">queue</h1>
                        <div className="queue-list">
                            <SongList
                                songs={playlist.queue}
                                type="queue"
                                removeSongFromQueueOrPlaylist={removeSongFromQueueOrPlaylist}
                                addSongToQueueOrQupplistHandler={addSongToQueueOrQupplistHandler}
                                colour="grey"
                            />
                        </div>
                    </Col>

                </Row>
            </div>
        </Fragment>
    )
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