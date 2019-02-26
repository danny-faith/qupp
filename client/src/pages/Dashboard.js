import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import PlaylistListItem from '../components/PlaylistListItem';
import CreatePlaylist from '../components/CreatePlaylist';


class Dashboard extends Component {
  componentDidMount = () => {
    if (!this.props.auth.isAuthenticated) {
            this.props.history.push('/login');
    }
  }
  componentWillReceiveProps = (nextProps) => {
      if (!nextProps.auth.isAuthenticated) {
          this.props.history.push('/login');
      }
  }
  render() {
    return (
      <div>
        <h1>Dashboard</h1>
        <h2>Playlists</h2>
        <CreatePlaylist title="No playlists found"/>
        <PlaylistListItem />
      </div>
    )
  }
}

Dashboard.propTypes = {
	auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
	auth: state.auth
});

export default connect(mapStateToProps)(withRouter(Dashboard));
