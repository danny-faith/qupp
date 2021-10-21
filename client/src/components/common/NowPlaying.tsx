import React from "react"
import { Song, Artist } from "../../interfaces"

interface NowPlayingProps {
	nowPlaying: Song
}

const NowPlaying: React.FC<NowPlayingProps> = ({ nowPlaying }) => {
	const { name, album, artists = [] } = nowPlaying

	return (
		<p className="m-0">
			<span>Now playing: </span>
			<span className="text-pink">
				{name} - {album} -{" "}
				{artists.map((artist: Artist) => (
					<span key={artist.id}>{artist.name} </span>
				))}
			</span>
		</p>
	)
}

NowPlaying.defaultProps = {
	nowPlaying: {
		name: "",
		album: "",
		artists: [],
	},
}

export default NowPlaying
