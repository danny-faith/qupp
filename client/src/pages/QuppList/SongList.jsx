import React from "react"
import Song from "../../components/playlist/Song"

const SongList = (props) => {
	const showNoSongsMessage = () => <p>No songs to show</p>

	const songComponents = ({
		songs,
		type,
		addSongToQueueOrQupplistHandler,
		removeSongFromSongList,
	}) =>
		songs.map((song, i) => (
			<Song
				addSongToQueueOrQupplistHandler={
					addSongToQueueOrQupplistHandler
				}
				removeSongFromSongList={removeSongFromSongList}
				type={type}
				data={song}
				index={i}
				key={`${i}${song.spotId}`}
			/>
		))

	const songListContent = () => {
		const {
			songs,
			addSongToQueueOrQupplistHandler,
			type,
			removeSongFromSongList,
		} = props
		const params = {
			songs,
			addSongToQueueOrQupplistHandler,
			removeSongFromSongList,
			type,
		}
		if (songs?.length > 0) {
			return songComponents(params)
		}
		return showNoSongsMessage()
	}
	// if (props.type === "qupplist") {
	// 	console.log("RERENDER compare", props.type)
	// }

	return <div>{songListContent()}</div>
}

const areEqual = (prevProps, nextProps) => {
	// console.log("compare", prevProps.type, nextProps.type)
	if (prevProps.type === "qupplist") {
		// debugger
		console.log(
			"compare song length",
			prevProps.songs.length === nextProps.songs.length
		)
		console.log("compare type", prevProps.type === nextProps.type)
		console.log("compare colour", prevProps.colour === nextProps.colour)
		console.log(
			"compare addSongToQueueOrQupplistHandler",
			prevProps.addSongToQueueOrQupplistHandler ===
				nextProps.addSongToQueueOrQupplistHandler
		)
		console.log(
			"compare removeSongFromSongList",
			prevProps.removeSongFromSongList ===
				nextProps.removeSongFromSongList
		)
	}
	// if (prevProps.songs.length === nextProps.songs.length) {
	// 	return true
	// }
	// return false
}

// SongList.whyDidYouRender = {
// 	logOnDifferentValues: true,
// 	customName: "SongList",
// }

export default React.memo(SongList)
