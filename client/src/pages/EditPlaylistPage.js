import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CreatePlaylist from '../components/playlist/CreatePlaylist';
import { getPlaylist } from '../actions/playlistActions';
import isEmpty from '../utils/isEmpty';

class EditPlaylist extends Component {

  componentDidMount = () => {
    // console.log(this.state);
    // console.log(this.props.match.params.playlist_id);
    
    // this.props.clearPlaylist();
    // this.props.getPlaylists(this.props.auth.user);
  }
  componentWillMount = () => {
    this.props.getPlaylist(this.props.match.params.playlist_id);   
    // console.log(this.state);

    // debugger;
  }
  componentWillReceiveProps = (nextProps) => {
      if (nextProps.playlist) {
        this.setState(nextProps.playlist, () => {
          // console.log(this.state);
      })
    }
    // this.something = 'helloo';
  }
  render() {
    // const loading = this.props.playlists.loading;
    // const playlists = this.props.playlists.playlists;
    // this.something = <CreatePlaylist name="something" slug="aslugdkvbsku" />;
    // let playlistContent;
    // console.log(this.state);
    if(!isEmpty(this.state)) {
      this.PostPlaylistComp = <CreatePlaylist name={this.state.playlist[0].name} slug={this.state.playlist[0].slug} id={this.props.match.params.playlist_id} title="Edit playlist" buttonText="Edit playlist"/>
    }

    return (
      <div>
        <h1>Edit playlist</h1>
        {this.PostPlaylistComp}
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
