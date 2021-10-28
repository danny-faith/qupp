import React, { Fragment } from "react"
import { Row, Col, Button } from "react-materialize"
import { SongResponse } from "../../interfaces"

interface SongProps {
	addSongToQueueOrQupplistHandler: Function
	removeSongFromSongList: Function
	type: string
	data: SongResponse
	index: number
	key: string
}

interface SongReturn {
	data: {}[]
}

interface IActionButton {
	dataType: string
	icon: string
	classNames: string
	action: Function
}

const Song: React.FC<SongProps> = ({
	type,
	data,
	addSongToQueueOrQupplistHandler,
	index,
	removeSongFromSongList,
}) => {
	const handleAddSong = (
		e: React.SyntheticEvent<HTMLButtonElement>
	): void => {
		const { type } = e.currentTarget.dataset
		const songToAdd = {
			name: data.name,
			album: data.album,
			image: data.image,
			artists: data.artists,
			spotId: data.spotId,
			duration_ms: data.duration_ms,
			uri: data.uri,
		}

		addSongToQueueOrQupplistHandler(songToAdd, type)
	}

	const handleRemoveSong = (e: React.SyntheticEvent<HTMLButtonElement>) => {
		removeSongFromSongList(index, e.currentTarget.dataset.type)
	}

	const createActionButton = ({
		dataType,
		classNames,
		icon,
		action,
	}: IActionButton) => (
		<Button
			onClick={action}
			data-type={dataType}
			floating
			icon={icon}
			className={classNames}
		/>
	)

	const buttonDecider = (type: string) => {
		switch (type) {
			case "search":
				return (
					<Fragment>
						{createActionButton({
							dataType: "qupplist",
							icon: "playlist_add",
							classNames: "blue",
							action: handleAddSong,
						})}
						{createActionButton({
							dataType: "queue",
							icon: "playlist_add",
							classNames: "yellow darken-1",
							action: handleAddSong,
						})}
					</Fragment>
				)
			case "qupplist":
				return (
					<Fragment>
						{createActionButton({
							dataType: "qupplist",
							icon: "delete",
							classNames: "red darken-1",
							action: handleRemoveSong,
						})}
						{createActionButton({
							dataType: "queue",
							icon: "playlist_add",
							classNames: "yellow darken-1",
							action: handleAddSong,
						})}
					</Fragment>
				)
			case "queue":
				return (
					<Fragment>
						{createActionButton({
							dataType: "queue",
							icon: "delete",
							classNames: "red darken-1",
							action: handleRemoveSong,
						})}
						{createActionButton({
							dataType: "qupplist",
							icon: "playlist_add",
							classNames: "blue darken-1",
							action: handleAddSong,
						})}
					</Fragment>
				)
			default:
				break
		}
	}

	const songButtons = buttonDecider(type)

	return (
		<Row className="py-3 darken-2 mb-0 flex">
			<Col s={2}>
				<img
					alt="Song cover"
					src={data.image}
					className="w-full block"
				/>
			</Col>
			<Col s={7} className="pl-0 flex items-center">
				<p className="my-0">
					{data.name}, {data.album}, Artists:
					{data.artists.map((key) => (
						<span key={key.name}> {key.name}</span>
					))}
				</p>
			</Col>
			<Col
				s={2}
				className="offset-s1 pl-0 relative flex items-center justify-around"
			>
				{songButtons}
			</Col>
		</Row>
	)
}

export default Song
