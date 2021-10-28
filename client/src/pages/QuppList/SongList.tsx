import React from "react"
import Song from "../../components/playlist/Song"
import { SongResponse } from "../../interfaces"

interface SongListProps {
	songs: SongResponse[]
	addSongToQueueOrQupplistHandler: Function
	type: string
	removeSongFromSongList: Function
}

const SongList: React.FC<SongListProps> = ({
	songs,
	addSongToQueueOrQupplistHandler,
	type,
	removeSongFromSongList,
}) => {
	const showNoSongsMessage = () => <p>No songs to show</p>

	const songComponents = () =>
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
		if (songs?.length > 0) {
			return songComponents()
		}
		return showNoSongsMessage()
	}

	return <div>{songListContent()}</div>
}

// SongList.whyDidYouRender = {
// 	logOnDifferentValues: true,
// 	customName: "SongList",
// }

export default React.memo(SongList)
