import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CreatePlaylist from '../components/playlist/CreatePlaylist';
import { getPlaylist } from '../actions/playlistActions';


class EditPlaylist extends Component {
  componentDidMount = () => {
    this.props.getPlaylist(this.props.match.params.playlist_id);    
    
    // this.props.clearPlaylist();
    // this.props.getPlaylists(this.props.auth.user);
  }
  componentWillMount = () => {
    
  }
  componentWillReceiveProps = (nextProps) => {
    console.log('nextProps: ', nextProps);
    // this.CreatePlaylistComp = (
    //   <CreatePlaylist name={nextProps.playlist.playlist[0].name} slug="aslugdkvbsku" id="5c7a77d6e53a7f772b428faa" title="Edit playlist" buttonText="Edit playlist"/>
    // );
    // if (nextProps.playlist) {
    //   this.setState(nextProps.playlist)
    // }
  }
  render() {
    // const loading = this.props.playlists.loading;
    // const playlists = this.props.playlists.playlists;
    
    // let playlistContent;

    // if (isEmpty(playlists) || loading) {
    //   playlistContent = <Spinner />;
    // } else {
    //   playlistContent = playlists
    //     .map(item => 
    //       <PlaylistListItem 
    //         key={item._id}
    //         id={item._id}
    //         name={item.name} 
    //         slug={item.slug} 
    //         shareLink={item.share_link}
    //       />
    //     );
    // }
    console.log(this.state || '');
    return (
      <div>
        <h1>Edit playlist</h1>
        <CreatePlaylist name="stuff" slug="aslugdkvbsku" id="5c7a77d6e53a7f772b428faa" title="Edit playlist" buttonText="Edit playlist"/>
        {/* {playlistContent} */}
      </div>
    )
  }
}

// Bring in the playlists state

EditPlaylist.propTypes = {
  getPlaylist: PropTypes.func.isRequired,
	playlist: PropTypes.object,
	auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	playlist: state.playlist
});

export default connect(mapStateToProps, { getPlaylist })(EditPlaylist);
