import React from "react"
import { Row, Col } from "react-materialize"
import NowPlaying from "../common/NowPlaying"
import UpNext from "../common/UpNext"
import ProgressBar from "./ProgressBar"

function Header(props) {
	const {
		playlistname,
		username,
		numberOfSongsInQueue,
		nowPlaying,
		upNext,
		playNextSong,
		duration_secs,
		playing,
	} = props

	return (
		<div className="header text-center py-8">
			<h1 className="text-5xl my-0">{playlistname}</h1>
			<p className="text-1xl mt-2 mb-0">{username}</p>
			<p className="text-1xl mt-0">
				{numberOfSongsInQueue}{" "}
				{numberOfSongsInQueue === 1 ? "song" : "songs"} in queue
			</p>
			<Row>
				<Col s={6} offset="s3">
					<ProgressBar
						playNextSong={playNextSong}
						duration_secs={duration_secs}
						playing={playing}
					/>
					<NowPlaying nowPlaying={nowPlaying} />
					<UpNext upNext={upNext} />
				</Col>
			</Row>
		</div>
	)
}

export default Header
