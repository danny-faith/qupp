import React from "react"
import { Song, Artist } from "../../interfaces"
// import PropTypes from "prop-types"

interface UpNextProps {
	upNext: Song
}

const UpNext: React.FC<UpNextProps> = ({ upNext }) => {
	const { name, album, artists = [] } = upNext

	return (
		<p className="m-0">
			<span>Up next: </span>
			<span className="text-green">
				{name} - {album} -{" "}
				{artists.map((artist: Artist) => (
					<span key={artist.id}>{artist.name} </span>
				))}
			</span>
		</p>
	)
}

// UpNext.propTypes = {
// 	upNext: PropTypes.object,
// }

UpNext.defaultProps = {
	upNext: {
		name: "",
		album: "",
		artists: [],
	},
}

export default UpNext
