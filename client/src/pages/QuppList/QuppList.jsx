import React, {
	useState,
	useEffect,
	Fragment,
	useCallback,
	useRef,
} from "react"
import { connect } from "react-redux"

import { firebase } from "../../base"
import PropTypes from "prop-types"
import { getPlaylist, clearPlaylists } from "../../actions/playlistActions"
import isEmpty from "../../utils/isEmpty"
import useInterval from "../../utils/useInterval"

import { Row, Col, Button } from "react-materialize"

import SearchForm from "../../components/playlist/SearchForm"
import Header from "../../components/playlist/Header"
import PlayButton from "../../components/player/PlayButton"
import SongList from "./SongList"

import { addSongToQupplist, addToQueue } from "./services/player"

import { remove, view } from "ramda"
import * as R from "ramda"

export function QuppListPage({
	clearPlaylists,
	getPlaylist,
	match,
	playlists,
	auth,
}) {
	const db = firebase.database()
	const [playlist, setPlaylist] = useState({
		qupplist: [],
		queue: [],
	})
	let payload = useRef()
	const [loadingPlaylists, setLoadingPlaylists] = useState({ status: true })
	const [playing, setPlaying] = useState(false)
	const [progress, setProgress] = useState(0)
	const [nowPlaying, setNowPlaying] = useState({})
	const [upNext, setUpNext] = useState({})
	const [searchResults, setSearchResults] = useState([])

	useEffect(() => {
		clearPlaylists()
		getPlaylist(match.params.slug)
	}, [clearPlaylists, getPlaylist, match.params.slug])

	const playClickHandler = () => {
		setPlaying((prevState) => !prevState)
	}

	useEffect(() => {
		if (playlists && playlists.playlist) {
			const playlistRef = db.ref(`playlists/${playlists.playlist._id}`)

			playlistRef.on("value", (snapshot) => {
				const snapShot = snapshot.val()
				let newData

				if (snapShot) {
					newData = snapShot
				} else {
					newData = {
						qupplist: [],
						queue: [],
					}
				}

				setPlaylist(newData)
			})

			return () => playlistRef.off()
		}
	}, [db, playlists])

	const duration_ms =
		playlist.queue?.length > 0 ? playlist.queue[0].duration_ms : 0
	const duration_secs = duration_ms / 1000
	let secondsPassed = Math.round((duration_secs / 100) * progress)

	useInterval(
		() => {
			const percent = Math.round((secondsPassed / duration_secs) * 100)
			setProgress(percent)
			if (percent >= 100) {
				setProgress(0)
				playNextSong()
			}
			secondsPassed++
		},
		playing ? 30 : null
	)

	useEffect(() => {
		if (!isEmpty(playlist.queue)) {
			setLoadingPlaylists({ status: false })
		}
		console.log("playlist check", playlist.queue, playlist.qupplist)
	}, [playlist])

	useEffect(() => {
		if (loadingPlaylists.status === false && isEmpty(playlist.queue)) {
			setNowPlaying({})
			setUpNext({})
			window.M.toast({
				html: "No more songs to play, please queue some",
				classes: "red lighten-2",
			})
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

	const playNextSong = () => {
		const cloneOfQueue = R.clone(playlist.queue)
		const slicedQueue = R.remove(0, 1, cloneOfQueue)
		setProgress(0)
		db.ref(`playlists/${playlists.playlist._id}/queue`).set(slicedQueue)
	}

	function usePrevious(value) {
		const ref = useRef()
		useEffect(() => {
			ref.current = value
		})
		return ref.current
	}

	const previousQueue = usePrevious(playlist.queue)
	const previousQupplist = usePrevious(playlist.qupplist)

	const manageSongNotifications = (previousQueue = [], nextQueue = []) => {
		const { type } = payload.current
		console.log(
			"manage",
			{ previousQueue },
			{ nextQueue },
			nextQueue?.length - previousQueue?.length
		)
		const moreThanOneSongAdded =
			nextQueue?.length - previousQueue?.length > 1
		const oneSongAdded = nextQueue?.length - previousQueue?.length === 1
		const songRemoved = nextQueue?.length - previousQueue?.length < 0
		console.log("manage", nextQueue?.length - previousQueue?.length)

		if (oneSongAdded) {
			const { name, album } = Array.isArray(payload.current.song)
				? payload.current.song[0]
				: payload.current.song

			window.M.toast({
				html: `${name}, ${album} added to ${type}`,
				classes: "green lighten-2",
			})
		} else if (type === "queue" && moreThanOneSongAdded) {
			const numberOfNewSongsAdded =
				nextQueue.length - previousQueue.length
			const songsAdded = R.slice(1, numberOfNewSongsAdded + 1, nextQueue)

			songsAdded.map(({ name, album }) =>
				window.M.toast({
					html: `${name}, ${album} added to ${type}`,
					classes: "green lighten-2",
				})
			)
		} else if (songRemoved) {
			const { name, album } = payload.current.song
			window.M.toast({
				html: `${name}, ${album} deleted from ${type}`,
				classes: "red lighten-2",
			})
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
		console.log("payload manage useeffect", payload.current)
		if (payload.current) {
			switch (payload.current.type) {
				case "queue":
					manageSongNotifications(previousQueue, playlist.queue)
					break
				case "qupplist":
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

	const addSearchResultsToState = useCallback(
		(results) => {
			setSearchResults(results)
		},
		[setSearchResults]
	)

	const addAllToQueueHandler = () => {
		if (isEmpty(playlist.qupplist)) {
			return window.M.toast({
				html: `No songs to add`,
				classes: "red lighten-2",
			})
		}
		addSongToQueueOrQupplistHandler(playlist.qupplist, "queue")
	}

	const addSongToQueueOrQupplistHandler = useCallback(
		(songPayload, type) => {
			const { qupplist = [], queue = [] } = playlist

			payload.current = R.clone({
				type,
				song: songPayload,
			})

			const qupplistExistsAndIsNotEmpty =
				type === "qupplist" && !isEmpty(playlist.qupplist)
			if (qupplistExistsAndIsNotEmpty) {
				const found = qupplist.find(
					(x) => x.spotId === songPayload.spotId
				)
				if (found) {
					return window.M.toast({
						html: `"${songPayload.name}" is a duplicate, cannot add`,
						classes: "red lighten-2",
					})
				}
			}

			let newPlaylist

			if (type === "qupplist") {
				newPlaylist = addSongToQupplist(songPayload, qupplist)
			} else if (type === "queue") {
				newPlaylist = addToQueue(songPayload, queue)
			}

			db.ref(`playlists/${playlists?.playlist?._id}/${type}`).set(
				newPlaylist
			)
		},
		[db, playlist, playlists.playlist]
	)

	const removeSongFromQueueOrPlaylist = useCallback(
		(index, type) => {
			const playlistLens = R.lensPath([type])
			const chosenPlaylist = view(playlistLens, playlist)
			const removeSongAtIndex = remove(index, 1)
			const song = R.slice(index, index + 1, chosenPlaylist)[0]

			payload.current = {
				type,
				song: song,
			}
			db.ref(`playlists/${playlists?.playlist?._id}/${type}`)
				.set(removeSongAtIndex(chosenPlaylist))
				.then(() => {
					console.log("item removed", playlist.qupplist)
				})
		},
		[db, playlist, playlists.playlist]
	)

	const clearSearchResults = useCallback(() => {
		setSearchResults([])
	}, [setSearchResults])

	const playlistName = playlists?.playlist?.name
	const playDisabled = isEmpty(playlist.queue) ? true : false

	return (
		<Fragment>
			<Header
				numberOfSongsInQueue={
					playlist.queue === undefined ? 0 : playlist.queue?.length
				}
				username={auth.user.name}
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
				></PlayButton>
				<Row className="flex flex-wrap md:block flex-col-reverse">
					<Col s={12} m={10} l={6} xl={4} offset="m1 xl2">
						<h1 className="text-blue darken-1">
							qupplist
							<Button
								onClick={addAllToQueueHandler}
								className="yellow text-black font-bold ml-4"
							>
								Add all to queue
							</Button>
						</h1>
						<SongList
							songs={playlist.qupplist}
							type="qupplist"
							removeSongFromQueueOrPlaylist={
								removeSongFromQueueOrPlaylist
							}
							addSongToQueueOrQupplistHandler={
								addSongToQueueOrQupplistHandler
							}
							colour="grey"
						/>
					</Col>

					<Col s={12} m={10} l={6} xl={4} offset="m1">
						<h1>search</h1>
						<SearchForm
							addSearchResultsToState={addSearchResultsToState}
						/>
						<Button
							className="white darken-1 text-black font-bold"
							onClick={clearSearchResults}
						>
							Clear search results
						</Button>
						<SongList
							songs={searchResults}
							type="search"
							addSongToQueueOrQupplistHandler={
								addSongToQueueOrQupplistHandler
							}
						/>
						<h1 className="text-yellow darken-1">queue</h1>
						<div className="queue-list">
							<SongList
								songs={playlist.queue}
								type="queue"
								removeSongFromQueueOrPlaylist={
									removeSongFromQueueOrPlaylist
								}
								addSongToQueueOrQupplistHandler={
									addSongToQueueOrQupplistHandler
								}
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
	auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	playlists: state.playlist,
})

export default connect(mapStateToProps, { getPlaylist, clearPlaylists })(
	QuppListPage
)
