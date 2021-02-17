import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CreatePlaylist from '../components/playlist/CreatePlaylist';
import { getPlaylist } from '../actions/playlistActions';
import isEmpty from '../utils/isEmpty';

class EditPlaylist extends Component {
    componentDidMount = () => {
        const { isAuthenticated } = this.props.auth

        if (!isAuthenticated) {
            this.props.history.push('/login');
        }
    }

    componentWillMount = () => {
        this.props.getPlaylist(this.props.match.params.slug);
    }

    componentWillReceiveProps = (nextProps) => {
        const { isAuthenticated } = nextProps.auth

        if (!isAuthenticated) {
            this.props.history.push('/login');
        }
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors,
            });
        }
        if (nextProps.playlist) {
            this.setState(nextProps.playlist);
        }
    }

    editQupplistContent = () => {
        const playlistsHaveLoaded = !isEmpty(this.state)

        if(playlistsHaveLoaded) {
            return (
                <CreatePlaylist
                    name={this.state.playlist.name}
                    slug={this.props.match.params.slug}
                    id={this.state.playlist._id}
                    title="Edit playlist"
                    buttonText="Edit playlist"
                />
            )
        }
    }

    render() {
        return (
            <div>
                <h1>Edit playlist</h1>
                {this.editQupplistContent()}
            </div>
        )
    }
}

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
