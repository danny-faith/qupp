import React, { useEffect, useState, useMemo, useLayoutEffect } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import CreatePlaylist from "../components/playlist/CreatePlaylist"
import { getPlaylist } from "../actions/playlistActions"
import isEmpty from "../utils/isEmpty"

function EditPlaylist({ history, auth, getPlaylist, playlist, match }) {
	const [currentPlaylist, setcurrentPlaylist] = useState({})

	useEffect(() => {
		const { isAuthenticated } = auth

		if (!isAuthenticated) {
			history.push("/login")
		}
	}, [auth, history])

	useLayoutEffect(() => {
		getPlaylist(match.params.slug)
	}, [getPlaylist, match.params.slug])

	useMemo(() => {
		const { isAuthenticated } = auth

		if (!isAuthenticated) {
			history.push("/login")
		}
		if (playlist) {
			setcurrentPlaylist(playlist)
		}
	}, [auth, history, setcurrentPlaylist, playlist])

	const editQupplistContent = () => {
		const playlistsHaveLoaded = !isEmpty(currentPlaylist.playlist)

		if (playlistsHaveLoaded) {
			return (
				<CreatePlaylist
					name={currentPlaylist.playlist.name}
					slug={currentPlaylist.playlist.slug}
					id={currentPlaylist.playlist._id}
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

const mapStateToProps = (state) => ({
	auth: state.auth,
	playlist: state.playlist,
})

export default connect(mapStateToProps, { getPlaylist })(EditPlaylist)
