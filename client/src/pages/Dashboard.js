import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import isEmpty from '../utils/isEmpty'
import arrayOfPlaylistComps from '../utils/arrayOfPlaylistComps'
import CreatePlaylist from '../components/playlist/CreatePlaylist'
import { getPlaylists, clearPlaylist } from '../actions/playlistActions'
import Spinner from '../components/common/Spinner'

class Dashboard extends Component {
	state = {
		data: {},
	}

	componentDidMount = () => {
		this.props.clearPlaylist()
		this.props.getPlaylists(this.props.auth.user)
	}

	componentWillReceiveProps = (nextProps) => {
		if (nextProps.playlists) {
			this.setState({
				data: nextProps.playlists
			})
		}
	}

	playlistContent = () => {
		const { loading } = this.props.playlists
		const { playlists } = this.props.playlists
	
		if (loading) {
			return <Spinner />
		} else if (isEmpty(playlists)) {
			return 'No playlists'
		} else {
			return arrayOfPlaylistComps(playlists)
		}
	}

	render() {
		return (
			<div>
				<h1>Dashboard</h1>
				<CreatePlaylist title="Create a qupplist"/>
				<h2>qupplists</h2>
				{this.playlistContent()}
			</div>
		)
	}
}

Dashboard.propTypes = {
	getPlaylists: PropTypes.func.isRequired,
	clearPlaylist: PropTypes.func.isRequired,
	playlist: PropTypes.object,
	auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	playlists: state.playlist
})

export default connect(mapStateToProps, { getPlaylists, clearPlaylist })(Dashboard)
