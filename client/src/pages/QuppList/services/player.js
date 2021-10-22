import { append, lensPath, view, slice, always, ifElse, hasPath } from "ramda"
import * as R from "ramda"
import isEmpty from "../../../utils/isEmpty"
import { cloneDeep } from "lodash"

function removeFirstSongFromQueue(queue) {
	const newQueue = slice(1, Infinity)
	return newQueue(queue)
}

function getNowPlayingSong(state) {
	const songUpNextPath = lensPath(["playlist", "queue", 0])
	const songUpNext = ifElse(
		hasPath(["playlist", "queue"]),
		view(songUpNextPath),
		always({})
	)
	return songUpNext(state)
}

function getUpNextSong(state) {
	const songUpNextPath = lensPath(["playlist", "queue", 1])
	const songUpNext = ifElse(
		hasPath(["playlist", "queue"]),
		view(songUpNextPath),
		always({})
	)
	return songUpNext(state)
}

function addToQueue(payload, queue) {
	const addingMultipleSongsToPopulatedQueue = () =>
		Array.isArray(payload) && R.gt(R.length(payload), 1)
	const addingOneSongToPopulatedQueue = () => !Array.isArray(payload)
	const addingOneSongInArrayToPopulatedQueue = () =>
		Array.isArray(payload) && payload.length === 1
	const emptyQueueAndAddingMultipleSongs = () =>
		R.isEmpty(queue) && Array.isArray(payload)
	const addingSingleSongsToEmptyQueue = () => R.isEmpty(queue) && R.is(Object)

	const newQueue = R.cond([
		[emptyQueueAndAddingMultipleSongs, R.always(payload)],
		[addingSingleSongsToEmptyQueue, R.always([payload])],
		[addingMultipleSongsToPopulatedQueue, R.insertAll(1, payload)],
		[addingOneSongToPopulatedQueue, R.insert(1, payload)],
		[addingOneSongInArrayToPopulatedQueue, R.insertAll(1, payload)],
	])

	return newQueue(queue)
}

function addSongToQupplist(song, qupplist) {
	const copyOfQupplist = append(song)
	return copyOfQupplist(qupplist)
}

function addSongToQueueOrQupplist(playlist, songPayload) {
	let newPlaylist = cloneDeep(playlist)

	// Firebase removes empty arrays
	// so if playlist.queue || playlist.qupplist exists, add to it
	// else(because Firebase removed it) create an empty array of either `song` or `queue` (type) then add to it

	// if songPayload > 1 then we're adding all in qupplist to the queue
	if (songPayload.length > 1) {
		// if playlist.qupplist is empty due to Firebase then create empty array
		if (isEmpty(newPlaylist)) {
			newPlaylist = []
		}
		// if (isEmpty(playlist.queue)) {
		//     playlist.queue = [];
		// }
		newPlaylist.push(...songPayload)
		// const newQueue = [...songPayload, ...playlist.queue];
		// playlist.queue = newQueue;
	} else {
		// console.log('type:', type);
		// // check where we're adding song to exists, if it doesn't then ...
		// if (this.state.playlist.hasOwnProperty(type)) {
		//     // if queue has more than one entry, add songPayload to second([1]) place in
		//     if (type === 'queue' && this.state.playlist.queue.length > 0) {
		//         playlist.queue.splice(1, 0, songPayload);
		//     } else {
		//         playlist[type].unshift(songPayload);
		//     }
		// } else {
		//     //  ... create empty array there then add song to it
		//     playlist[type] = [];
		//     playlist[type].unshift(songPayload);
		// }
	}
}

export {
	// playNextSong,
	addSongToQupplist,
	addToQueue,
	addSongToQueueOrQupplist,
	removeFirstSongFromQueue,
	getNowPlayingSong,
	getUpNextSong,
}
