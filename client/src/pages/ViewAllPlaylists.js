import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import isEmpty from '../utils/isEmpty'
import arrayOfPlaylistComps from '../utils/arrayOfPlaylistComps'
import Spinner from '../components/common/Spinner'
import { getAllPlaylists } from '../actions/playlistActions'

function ViewAllPlaylists(props) {
    useEffect(() => {
        props.getAllPlaylists()
    }, [])

    const playlistContent = () => {
        const loading = props.playlists.loading
        const playlists = props.playlists.playlists
    
        if (isEmpty(playlists) || loading) {
            return <Spinner />
        } else {
            return arrayOfPlaylistComps(playlists)
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

const mapStateToProps = (state) => ({
    playlists: state.playlist
})

export default connect(mapStateToProps, { getAllPlaylists })(ViewAllPlaylists)