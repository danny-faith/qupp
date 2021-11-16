import React, { ReactElement, useEffect } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import isEmpty from "../utils/isEmpty"
import arrayOfPlaylistComps from "../utils/arrayOfPlaylistComps"
import Spinner from "../components/common/Spinner"
import { getAllPlaylists } from "../actions/playlistActions"
import { Playlists, Playlist } from "interfaces"

type ViewAllPlaylistsProps = {
	getAllPlaylists: Function
	playlists: Playlists
}

type ViewAllPlaylistsState = {
	playlist: Playlist
}

function ViewAllPlaylists({
	getAllPlaylists,
	playlists,
}: ViewAllPlaylistsProps) {
	useEffect(() => {
		getAllPlaylists()
	}, [getAllPlaylists])

	const playlistContent = (): ReactElement | ReactElement[] => {
		if (isEmpty(playlists?.playlists) || playlists.loading) {
			return <Spinner />
		} else {
			return arrayOfPlaylistComps(playlists.playlists)
		}
	}

	return (
		<div>
			<h1>View all playlists</h1>
			{playlistContent()}
		</div>
	)
}

ViewAllPlaylists.propTypes = {
	getAllPlaylists: PropTypes.func.isRequired,
	playlist: PropTypes.object,
}

const mapStateToProps = (state: ViewAllPlaylistsState) => ({
	playlists: state.playlist,
})

export default connect(mapStateToProps, { getAllPlaylists })(ViewAllPlaylists)
