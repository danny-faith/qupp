import React from "react"
import Song from "../../components/playlist/Song"

function SongList(props) {
	const showNoSongsMessage = () => <p>No songs to show</p>

	const songComponents = ({
		songs,
		type,
		addSongToQueueOrQupplistHandler,
		removeSongFromQueueOrPlaylist,
	}) =>
		songs.map((song, i) => (
			<Song
				addSongToQueueOrQupplistHandler={
					addSongToQueueOrQupplistHandler
				}
				removeSongFromQueueOrPlaylist={removeSongFromQueueOrPlaylist}
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
			removeSongFromQueueOrPlaylist,
		} = props
		const params = {
			songs,
			addSongToQueueOrQupplistHandler,
			removeSongFromQueueOrPlaylist,
			type,
		}
		console.log("songs", songs)
		if (songs?.length > 0) {
			return songComponents(params)
		}
		return showNoSongsMessage()
	}

	return <div>{songListContent()}</div>
}

export default SongList
