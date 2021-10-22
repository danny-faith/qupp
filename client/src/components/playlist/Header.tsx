import React from "react"
import { Row, Col } from "react-materialize"
import NowPlaying from "../common/NowPlaying"
import UpNext from "../common/UpNext"
import ProgressBar from "./ProgressBar"
import { Song } from "../../interfaces"

interface HeaderProps {
	playlistname: string
	username: string
	numberOfSongsInQueue: number
	nowPlaying: Song
	upNext: Song
	progressOnComplete: Function
	duration_secs: number
	playing: boolean
}

const Header: React.FC<HeaderProps> = ({
	playlistname,
	username,
	numberOfSongsInQueue,
	nowPlaying,
	upNext,
	progressOnComplete,
	duration_secs,
	playing,
}) => {
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
						onComplete={progressOnComplete}
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
