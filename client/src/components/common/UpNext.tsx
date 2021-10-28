import React from "react"
import { SongResponse, SongResponseArtist } from "../../interfaces"
import { isNil, isEmpty } from "ramda"

interface UpNextProps {
	upNext?: SongResponse
}

function UpNext({ upNext }: UpNextProps) {
	return (
		<p className="m-0">
			<span>Up next: </span>
			{!isNil(upNext) && !isEmpty(upNext) ? (
				<span className="text-pink">
					{upNext.name} - {upNext.album} -{" "}
					{upNext.artists.map((artist: SongResponseArtist) => (
						<span key={artist.id}>{artist.name} </span>
					))}
				</span>
			) : (
				"- -"
			)}
		</p>
	)
}

export default UpNext
