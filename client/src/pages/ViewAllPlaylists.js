import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import isEmpty from '../utils/isEmpty'
import Spinner from '../components/common/Spinner'
import PlaylistListItem from '../components/playlist/PlaylistListItem'
import { getAllPlaylists } from '../actions/playlistActions'

class ViewAllPlaylists extends Component {
    componentDidMount = () => {
        this.props.getAllPlaylists()
    }

    arrayOfPlaylistComps = (playlists) => (
		playlists
			.map((playlist) => (
				<PlaylistListItem 
					key={playlist._id}
					id={playlist._id}
					name={playlist.name} 
					slug={playlist.slug} 
					shareLink={playlist.share_link}
				/>
			)
		)
	)

    playlistContent = () => {
        const loading = this.props.playlists.loading
        const playlists = this.props.playlists.playlists
    
        if (isEmpty(playlists) || loading) {
            return <Spinner />
        } else {
            return this.arrayOfPlaylistComps(playlists)
        }
    }

    render() {
        return (
            <div>
                <h1>View all playlists</h1>
                {this.playlistContent()}
            </div>
        )
    }
}

ViewAllPlaylists.propTypes = {
    getAllPlaylists: PropTypes.func.isRequired,
    playlist: PropTypes.object,
}

const mapStateToProps = (state) => ({
    playlists: state.playlist
})

export default connect(mapStateToProps, { getAllPlaylists })(ViewAllPlaylists)