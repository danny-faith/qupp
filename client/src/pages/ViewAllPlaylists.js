import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEmpty from '../utils/isEmpty';
import Spinner from '../components/common/Spinner';
import PlaylistListItem from '../components/playlist/PlaylistListItem';
import { getAllPlaylists } from '../actions/playlistActions';

class ViewAllPlaylists extends Component {
    componentDidMount = () => {
        this.props.getAllPlaylists();
    }
  render() {
    const loading = this.props.playlists.loading;
    const playlists = this.props.playlists.playlists;
    
    let playlistContent;

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
        <h1>View all playlists</h1>
        {playlistContent}
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
});

export default connect(mapStateToProps, { getAllPlaylists })(ViewAllPlaylists);