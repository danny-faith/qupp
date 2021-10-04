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

const qupplistText = "qupplist"
const greyText = "grey"
export function QuppListPage({
	clearPlaylists,
	getPlaylist,
	match,
	playlists,
	auth,
}) {
	const db = firebase.database()
	// const [playlist, setPlaylist] = useState({
	// 	qupplist: [],
	// 	queue: [],
	// })
	const [qupplist, setQupplist] = useState([])
	const [queue, setQueue] = useState([])
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
				let qupplist
				let queue
				// console.log("snapshot", snapShot)

				if (snapShot) {
					qupplist = snapShot.qupplist || []
					queue = snapShot.queue || []
				} else {
					qupplist = []
					queue = []
				}

				setQupplist(qupplist)
				setQueue(queue)
			})

			return () => playlistRef.off()
		}
	}, [db, playlists])

	const duration_ms = queue?.length > 0 ? queue[0].duration_ms : 0
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
		if (!isEmpty(queue)) {
			setLoadingPlaylists({ status: false })
		}
		// console.log("playlist check", playlist.queue, playlist.qupplist)
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
		const cloneOfQueue = R.clone(queue)
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

	const previousQueue = usePrevious(queue)
	const previousQupplist = usePrevious(qupplist)

	const manageSongNotifications = (previousQueue = [], nextQueue = []) => {
		const { type } = payload.current
		// console.log(
		// 	"manage",
		// 	{ previousQueue },
		// 	{ nextQueue },
		// 	nextQueue?.length - previousQueue?.length
		// )
		const moreThanOneSongAdded =
			nextQueue?.length - previousQueue?.length > 1
		const oneSongAdded = nextQueue?.length - previousQueue?.length === 1
		const songRemoved = nextQueue?.length - previousQueue?.length < 0
		// console.log("manage", nextQueue?.length - previousQueue?.length)

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
		// console.log("payload manage useeffect", payload.current)
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

	const addSongToQueueOrQupplistHandler = useCallback(
		(songPayload, type) => {
			console.log("daniel", queue)
			// alert("ddaa")
			// console.log("daniel", playlists.playlist._id)
			// const { qupplist = [], queue = [] } = playlist
			// TODO:
			payload.current = R.clone({
				type,
				song: songPayload,
			})
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
			let newPlaylist
			if (type === "qupplist") {
				newPlaylist = addSongToQupplist(songPayload, qupplist)
			} else if (type === "queue") {
				newPlaylist = addToQueue(songPayload, queue)
			}
			// if (playlists && playlists.playlist) {
			db.ref(`playlists/${playlists?.playlist?._id}/${type}`).set(
				newPlaylist
			)
			console.log("hello", songPayload)
			// }
		},
		[db, playlists, queue]
	)

	const removeSongFromQueueOrPlaylist = useCallback(
		(index, type) => {
			// const playlistLens = R.lensPath([type])
			// const chosenPlaylist = view(playlistLens, playlist)
			const chosenPlaylist = type === "qupplist" ? qupplist : queue
			const removeSongAtIndex = remove(index, 1)
			const song = R.slice(index, index + 1, chosenPlaylist)[0]
			payload.current = {
				type,
				song: song,
			}
			// if (playlists && playlists.playlist) {
			db.ref(`playlists/${playlists?.playlist?._id}/${type}`)
				.set(removeSongAtIndex(chosenPlaylist))
				.then(() => {
					console.log("item removed", qupplist)
				})
			// }
		},
		[db, playlists, queue, qupplist]
	)

	const clearSearchResults = useCallback(() => {
		setSearchResults([])
	}, [setSearchResults])

	const playlistName = playlists?.playlist?.name
	const playDisabled = isEmpty(queue) ? true : false
	// const qupplist = React.useMemo(() => playlist.qupplist, [playlist.qupplist])
	// SongList's are all re-rendering unneccesarily when you click a button that doesn't affect the props of the SongList it was clicked in
	// E.g click add to playlist button(yellow) from qupplist list and the qupplist will re-render
	//  worry is that this is not fixable as WDYR isn't picking it up and loggin warnings

	// SEPARATE qupplist and queue into their own state so you don't have to pass in a new object everytime you update them
	// That's likely the cause of qupplist re-rendering when something is added to queue which is in it's state
	return (
		<Fragment>
			<Header
				numberOfSongsInQueue={queue === undefined ? 0 : queue?.length}
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
							// songs={qupplist}
							songs={qupplist}
							type={qupplistText}
							removeSongFromQueueOrPlaylist={
								removeSongFromQueueOrPlaylist
							}
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
