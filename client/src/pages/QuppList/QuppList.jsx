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

import { Row, Col, Button } from "react-materialize"

import SearchForm from "../../components/playlist/SearchForm"
import Header from "../../components/playlist/Header.tsx"
import PlayButton from "../../components/player/PlayButton"
import SongList from "./SongList"

import { addSongToQupplist, addToQueue } from "./services/player"

import { remove } from "ramda"
import * as R from "ramda"

const db = firebase.database()
const qupplistText = "qupplist"
const greyText = "grey"
export function QuppListPage({
	clearPlaylists,
	getPlaylist,
	match,
	playlists,
	auth,
}) {
	const [qupplist, setQupplist] = useState([])
	const [queue, setQueue] = useState([])
	let payload = useRef()
	const [loadingPlaylists, setLoadingPlaylists] = useState({ status: true })
	const [playing, setPlaying] = useState(false)
	// const [progress, setProgress] = useState(0)
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

	const syncSongListState = useCallback(
		(target, setter) => {
			const playlistRef = db.ref(
				`playlists/${playlists.playlist._id}/${target}`
			)
			playlistRef.on("value", (snapshot) => {
				const snapShot = snapshot.val()

				setter(snapShot)
			})
			return () => playlistRef.off()
		},
		[playlists]
	)

	useEffect(() => {
		if (playlists && playlists.playlist) {
			syncSongListState("qupplist", setQupplist)
		}
	}, [playlists, syncSongListState])

	useEffect(() => {
		if (playlists && playlists.playlist) {
			syncSongListState("queue", setQueue)
		}
	}, [playlists, syncSongListState])

	useEffect(() => {
		if (!isEmpty(queue)) {
			setLoadingPlaylists({ status: false })
		}
	}, [queue])

	useEffect(() => {
		if (loadingPlaylists.status === false && isEmpty(queue)) {
			setNowPlaying({})
			setUpNext({})
			window.M.toast({
				html: "No more songs to play, please queue some",
				classes: "red lighten-2",
			})
		}
		if (queue?.length === 1) {
			setNowPlaying(queue[0])
			setUpNext({})
		}
		if (queue?.length > 1) {
			setNowPlaying(queue[0])
			setUpNext(queue[1])
		}
	}, [loadingPlaylists, queue])

	const playNextSong = () => {
		console.log("playNextSong")
		const cloneOfQueue = R.clone(queue)
		const slicedQueue = R.remove(0, 1, cloneOfQueue)
		db.ref(`playlists/${playlists.playlist._id}/queue`).set(slicedQueue)
	}

	function usePrevious(value) {
		const ref = useRef()
		useEffect(() => {
			ref.current = value
		})
		return ref.current
	}

	const previousQueue = usePrevious(queue)
	const previousQupplist = usePrevious(qupplist)

	const manageSongNotifications = (previousQueue = [], nextQueue = []) => {
		const { type } = payload.current
		const moreThanOneSongAdded =
			nextQueue?.length - previousQueue?.length > 1
		const oneSongAdded = nextQueue?.length - previousQueue?.length === 1
		const songRemoved = nextQueue?.length - previousQueue?.length < 0

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
		if (queue && queue?.length > 0) {
			if (queue?.length > 1) {
				setUpNext(queue[1])
			}
			setNowPlaying(queue[0])
		}
	}, [previousQueue, previousQupplist, queue])

	useEffect(() => {
		if (payload.current) {
			switch (payload.current.type) {
				case "queue":
					manageSongNotifications(previousQueue, queue)
					break
				case "qupplist":
					manageSongNotifications(previousQupplist, qupplist)
					break
				default:
					break
			}
		}
	}, [previousQueue, previousQupplist, queue, qupplist])

	useEffect(() => {
		if (playing && isEmpty(queue)) {
			setPlaying(false)
		}
	}, [playing, queue])

	const addSearchResultsToState = useCallback(
		(results) => {
			setSearchResults(results)
		},
		[setSearchResults]
	)

	const addAllToQueueHandler = () => {
		if (isEmpty(qupplist)) {
			return window.M.toast({
				html: `No songs to add`,
				classes: "red lighten-2",
			})
		}
		addSongToQueueOrQupplistHandler(qupplist, "queue")
	}

	const checkIfSongExistsInQupplist = useCallback(
		(songPayload, type) => {
			const qupplistExistsAndIsNotEmpty =
				type === "qupplist" && !isEmpty(qupplist)

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
		},
		[qupplist]
	)

	const addSongToQueueOrQupplistHandler = useCallback(
		(songPayload, type) => {
			if (checkIfSongExistsInQupplist(songPayload, type)) {
				return
			}

			setPayload(type, songPayload)

			let newPlaylist
			if (type === "qupplist") {
				setQupplist((oldState) => {
					newPlaylist = addSongToQupplist(songPayload, oldState)
					db.ref(`playlists/${playlists?.playlist?._id}/${type}`).set(
						newPlaylist
					)
				})
			} else if (type === "queue") {
				setQueue((oldState) => {
					const oldStateCheck = oldState === null ? [] : oldState

					newPlaylist = addToQueue(songPayload, oldStateCheck)
					db.ref(`playlists/${playlists?.playlist?._id}/${type}`).set(
						newPlaylist
					)
				})
			}
		},
		[playlists, checkIfSongExistsInQupplist]
	)

	const setPayload = (type, song) => {
		payload.current = {
			type,
			song: song,
		}
	}

	const removeSongFromSongList = useCallback(
		(type, index, state) => {
			const removeSongAtIndex = remove(index, 1)
			const song = R.slice(index, index + 1, state)[0]
			setPayload("queue", song)
			db.ref(`playlists/${playlists?.playlist?._id}/${type}`).set(
				removeSongAtIndex(state)
			)
		},
		[playlists.playlist]
	)

	const removeSongFromQueue = useCallback(
		(index) => {
			setQueue((oldState) => {
				removeSongFromSongList("queue", index, oldState)
			})
		},
		[removeSongFromSongList]
	)

	const removeSongFromQupplist = useCallback(
		(index) => {
			setQupplist((oldState) => {
				removeSongFromSongList("qupplist", index, oldState)
			})
		},
		[removeSongFromSongList]
	)

	const clearSearchResults = useCallback(() => {
		setSearchResults([])
	}, [setSearchResults])

	const playlistName = playlists?.playlist?.name
	const playDisabled = isEmpty(queue) ? true : false
	const duration_ms = queue?.length > 0 ? queue[0].duration_ms : 0
	const duration_secs = duration_ms / 1000

	return (
		<Fragment>
			<Header
				numberOfSongsInQueue={queue === undefined ? 0 : queue?.length}
				username={auth.user.name}
				playlistname={playlistName}
				nowPlaying={nowPlaying}
				upNext={upNext}
				progressOnComplete={playNextSong}
				duration_secs={duration_secs}
				playing={playing}
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
							songs={qupplist}
							type={qupplistText}
							removeSongFromSongList={removeSongFromQupplist}
							addSongToQueueOrQupplistHandler={
								addSongToQueueOrQupplistHandler
							}
							colour={greyText}
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
								songs={queue}
								type="queue"
								removeSongFromSongList={removeSongFromQueue}
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
