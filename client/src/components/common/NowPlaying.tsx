import React from "react"
import { SongResponse, SongResponseArtist } from "../../interfaces"
import { isEmpty, isNil } from "ramda"

interface NowPlayingProps {
	nowPlaying?: SongResponse
}

function NowPlaying({ nowPlaying }: NowPlayingProps) {
	return (
		<p className="m-0">
			<span>Now playing: </span>
			{!isNil(nowPlaying) && !isEmpty(nowPlaying) ? (
				<span className="text-pink">
					{nowPlaying.name} - {nowPlaying.album} -{" "}
					{nowPlaying.artists.map((artist: SongResponseArtist) => (
						<span key={artist.id}>{artist.name} </span>
					))}
				</span>
			) : (
				"- -"
			)}
		</p>
	)
}

export default NowPlaying
