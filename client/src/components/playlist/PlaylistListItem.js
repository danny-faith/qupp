import React, { Component } from 'react';
import { Row, Col, Button, Icon } from 'react-materialize';
import { connect } from 'react-redux';
import { withRouter, Link } from "react-router-dom";
import { deletePlaylist } from '../../actions/playlistActions';
import PropTypes from 'prop-types';
import copyToClipboard from '../../utils/copyToClipboard';

require('dotenv').config();

const { 
  REACT_APP_ENV
} = process.env;

class PlaylistListItem extends Component {
    componentWillMount = () => {
        this.share_link = `${REACT_APP_ENV}/playlist/${this.props.slug}`;
    }
    handleDeleteClick = () => { 
        this.props.deletePlaylist(this.props.id);
    }
    handleCopyToClipboardClick = () => {
        // const share_link = `https://qupp.2112staging.com/playlist/${this.props.slug}`;
        copyToClipboard(this.share_link);
        navigator.clipboard.readText()
            .then(() => window.M.toast({html: `Copied to clipboard`, classes: 'green lighten-2'}))
            .catch(() => window.M.toast({html: `Error copy link, please try again`, classes: 'red lighten-2'}));
    }
    render() {
        return (
            <Row>
                <Col s={7}>
                    <h5>{this.props.name}</h5>
                </Col>
                <Col s={5}>
                    <Button onClick={this.handleDeleteClick} className="right red lighten-1" waves='light'><Icon>delete</Icon></Button>
                    <Link className="btn waves-effect waves-light right" to={`/playlist/${this.props.slug}/${this.props.id}`}><Icon>visibility</Icon></Link>
                    <Link className="yellow darken-3 btn waves-effect waves-light right" to={`/edit-playlist/${this.props.slug}`}><Icon>edit</Icon></Link>
                    <Button onClick={this.handleCopyToClipboardClick} className="right blue" waves='light'><Icon>file_copy</Icon></Button>
                </Col>
                <Col s={8}>
                    <p>{this.share_link}</p>
                </Col>
            </Row>
        )
    }
}

PlaylistListItem.propTypes = {
    deletePlaylist: PropTypes.func.isRequired
}

export default connect(null, { deletePlaylist })(withRouter(PlaylistListItem));