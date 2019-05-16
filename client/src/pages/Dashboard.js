import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import { Link, withRouter } from 'react-router-dom';
import PlaylistListItem from '../components/playlist/PlaylistListItem';
import isEmpty from '../utils/isEmpty';
import CreatePlaylist from '../components/playlist/CreatePlaylist';
import { getPlaylists, clearPlaylist } from '../actions/playlistActions';
import Spinner from '../components/common/Spinner';

class Dashboard extends Component {
  // looks like I don't actually need state.data
  // update componentWillReceiveProps setState
  state = {
    data: []
  }
  componentDidMount = () => {
    this.props.clearPlaylist();
    this.props.getPlaylists(this.props.auth.user);
  }
  componentWillMount = () => {
    
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
    // TODO change isEmpty to === null
    if (isEmpty(playlists) || loading) {
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
        <CreatePlaylist title="Create a qupplist"/>
        <h2>qupplists</h2>
        {playlistContent}
      </div>
    )
  }
}

// Bring in the playlists state

Dashboard.propTypes = {
  getPlaylists: PropTypes.func.isRequired,
  clearPlaylist: PropTypes.func.isRequired,
	playlist: PropTypes.object,
	auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	playlists: state.playlist
});

export default connect(mapStateToProps, { getPlaylists, clearPlaylist })(Dashboard);
