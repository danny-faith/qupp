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
    const playlists = this.state.playlists;
    
    return (
      <div>
        <h1>Dashboard</h1>
        <h2>Playlists</h2>
        <CreatePlaylist title="Create a playlist"/>
        {playlists.map(item => 
          <PlaylistListItem 
            key={item._id}
            id={item._id}
            name={item.name} 
            shareLink={item.share_link}
          />
        )}
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
