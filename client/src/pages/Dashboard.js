import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import PlaylistListItem from '../components/PlaylistListItem';
import CreatePlaylist from '../components/CreatePlaylist';
import { getPlaylists } from '../actions/playlistActions';


class Dashboard extends Component {
  state = {
    playlists: []
  }
  componentDidMount = () => {
    this.props.getPlaylists(this.props.auth.user);
  }
  componentWillReceiveProps = (nextProps) => {
    
    if (nextProps.playlists) {
      this.setState({
        playlists: nextProps.playlists
      })
    }
  }
  render() {
    return (
      <div>
        <h1>Dashboard</h1>
        <h2>Playlists</h2>
        <CreatePlaylist title="No playlists found"/>
        {/* <PlaylistListItem /> */}
      </div>
    )
  }
}

// Bring in the playlists state

Dashboard.propTypes = {
  getPlaylists: PropTypes.func.isRequired,
	playlist: PropTypes.object,
	auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	playlists: state.playlist.playlists
});

export default connect(mapStateToProps, { getPlaylists })(Dashboard);
