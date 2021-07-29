import React, { useEffect, useState, useMemo, useLayoutEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import CreatePlaylist from '../components/playlist/CreatePlaylist'
import { getPlaylist } from '../actions/playlistActions'
import isEmpty from '../utils/isEmpty'

function EditPlaylist(props) {
    const [playlist, setPlaylist] = useState({})
    const [errors, setErrors] = useState([])

    useEffect(() => {
        const { isAuthenticated } = props.auth
    
        if (!isAuthenticated) {
            props.history.push('/login')
        }
    }, [])

    useLayoutEffect(() => {
        props.getPlaylist(props.match.params.slug)
    }, [])

    useMemo(() => {
        const { isAuthenticated } = props.auth

        if (!isAuthenticated) {
            props.history.push('/login')
        }
        if (props.errors) {
            setErrors(props.errors)
        }
        if (props.playlist) {
            setPlaylist(props.playlist)
        }
    }, [props.errors, props.playlist, props.auth])

    const editQupplistContent = () => {
        const playlistsHaveLoaded = !isEmpty(playlist.playlist)

        if (playlistsHaveLoaded) {
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
            {errors}
            {editQupplistContent()}
        </div>
    )
}

EditPlaylist.propTypes = {
  getPlaylist: PropTypes.func.isRequired,
  playlist: PropTypes.object,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  playlist: state.playlist
})

export default connect(mapStateToProps, { getPlaylist })(EditPlaylist)
