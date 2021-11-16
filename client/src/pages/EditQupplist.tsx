import React, { useEffect, useMemo, useLayoutEffect } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import CreatePlaylist from "../components/playlist/CreatePlaylist"
import { getPlaylist } from "../actions/playlistActions"
import { Auth, Playlist, Playlists } from "interfaces"
import { RouteComponentProps } from "react-router"
import { useParams } from "react-router-dom"
import { isEmpty } from "ramda"

type EditPlaystProps = RouteComponentProps & {
	getPlaylist: Function
	playlist: Playlists
	auth: Auth
}

interface ReduxEditPlaylistState {
	auth: Auth
	playlist: Playlist
}

function EditPlaylist({
	history,
	auth,
	getPlaylist,
	playlist,
}: EditPlaystProps) {
	const { slug } = useParams()

	useEffect(() => {
		const { isAuthenticated } = auth

		if (!isAuthenticated) {
			history.push("/login")
		}
	}, [auth, history])

	useLayoutEffect(() => {
		getPlaylist(slug)
	}, [getPlaylist, slug])

	useMemo(() => {
		const { isAuthenticated } = auth

		if (!isAuthenticated) {
			history.push("/login")
		}
	}, [auth, history])

	const editQupplistContent = () => {
		if (!isEmpty(playlist.playlist)) {
			return (
				<CreatePlaylist
					name={playlist.playlist.name}
					slug={playlist.playlist.slug}
					id={playlist.playlist._id}
					title="Edit playlist"
					buttonText="Edit playlist"
				/>
			)
		}
	}

	return (
		<div>
			<h1>Edit playlist</h1>

			{editQupplistContent()}
		</div>
	)
}

EditPlaylist.propTypes = {
	getPlaylist: PropTypes.func.isRequired,
	playlist: PropTypes.object,
	auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state: ReduxEditPlaylistState) => ({
	auth: state.auth,
	playlist: state.playlist,
})

export default connect(mapStateToProps, { getPlaylist })(EditPlaylist)
