import React, { useEffect } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import isEmpty from "../utils/isEmpty"
import arrayOfPlaylistComps from "../utils/arrayOfPlaylistComps"
import CreatePlaylist from "../components/playlist/CreatePlaylist"
import { getPlaylists, clearPlaylist } from "../actions/playlistActions"
import Spinner from "../components/common/Spinner"
import { Playlists, Auth } from "../interfaces"

interface DashboardProps {
	getPlaylists: Function
	clearPlaylist: Function
	playlists: Playlists
	auth: Auth
}

type DashboardState = {
	auth: Auth
	playlists: Playlists
	playlist: Playlists
}

function Dashboard({
	clearPlaylist,
	getPlaylists,
	playlists,
	auth,
}: DashboardProps) {
	useEffect(() => {
		clearPlaylist()
		getPlaylists(auth.user)
	}, [clearPlaylist, getPlaylists, auth.user])

	const playlistContent = () => {
		const { loading } = playlists

		if (loading) {
			return <Spinner />
		} else if (isEmpty(playlists)) {
			return "No playlists"
		} else if (playlists.playlists?.length > 0) {
			return arrayOfPlaylistComps(playlists.playlists)
		}
	}

	return (
		<div>
			<h1>Dashboard</h1>
			<CreatePlaylist title="Create a qupplist" />
			<h2>qupplists</h2>
			{playlistContent()}
		</div>
	)
}

Dashboard.propTypes = {
	getPlaylists: PropTypes.func.isRequired,
	clearPlaylist: PropTypes.func.isRequired,
	playlist: PropTypes.object,
	auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state: DashboardState) => ({
	auth: state.auth,
	playlists: state.playlist,
})

export default connect(mapStateToProps, { getPlaylists, clearPlaylist })(
	Dashboard
)
