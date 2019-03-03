import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import PlaylistListItem from '../components/PlaylistListItem';
import CreatePlaylist from '../components/CreatePlaylist';
import { getPlaylists } from '../actions/playlistActions';
import Spinner from '../components/common/Spinner';


class Dashboard extends Component {
  state = {
    data: []
  }
  componentDidMount = () => {
    this.props.getPlaylists(this.props.auth.user);
  }
  componentWillReceiveProps = (nextProps) => {
    
    if (nextProps.playlists) {
      this.setState({
        data: nextProps.playlists
      })
    }
  }
  render() {
    const loading = this.props.playlists.loading;
    const playlists = this.props.playlists.playlists;
    let playlistContent;

    if (playlists === null || loading) {
      playlistContent = <Spinner />;
    } else {
      playlistContent = playlists
        .map(item => 
          <PlaylistListItem 
            key={item._id}
            id={item._id}
            name={item.name} 
            slug={item.slug} 
            shareLink={item.share_link}
          />
        );
    }
    
    return (
      <div>
        <h1>Dashboard</h1>
        <h2>Playlists</h2>
        <CreatePlaylist title="Create a playlist"/>
        {playlistContent}
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
	playlists: state.playlist
});

export default connect(mapStateToProps, { getPlaylists })(Dashboard);
