import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CreatePlaylist from '../components/playlist/CreatePlaylist';
import { getPlaylist } from '../actions/playlistActions';
import isEmpty from '../utils/isEmpty';

class EditPlaylist extends Component {

  componentDidMount = () => {
    if (!this.props.auth.isAuthenticated) {
        this.props.history.push('/login');
    }
  }
  componentWillMount = () => {
    this.props.getPlaylist(this.props.match.params.slug);
  }
  componentWillReceiveProps = (nextProps) => {
    if (!nextProps.auth.isAuthenticated) {
        this.props.history.push('/login');
    }
    if (nextProps.errors) {
        this.setState({errors: nextProps.errors});
    }
    if (nextProps.playlist) {
      this.setState(nextProps.playlist);
    }
  }
  render() {
    if(!isEmpty(this.state)) {      
      this.PostPlaylistComp = <CreatePlaylist name={this.state.playlist[0].name} slug={this.props.match.params.slug} id={this.state.playlist[0]._id} title="Edit playlist" buttonText="Edit playlist"/>
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
