import React from "react"

function NowPlaying(props) {
	const { name, album, artists = [] } = props.nowPlaying

	return (
		<p className="m-0">
			<span>Now playing: </span>
			<span className="text-pink">
				{name} - {album} -{" "}
				{artists.map((artist) => (
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
