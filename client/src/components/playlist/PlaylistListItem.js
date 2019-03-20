import React, { Component } from 'react';
import { Row, Col, Button, Icon } from 'react-materialize';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { deletePlaylist } from '../../actions/playlistActions';
import PropTypes from 'prop-types';
import copyToClipboard from '../../utils/copyToClipboard';

class PlaylistListItem extends Component {
    handleDeleteClick = () => { 
        console.log(this.props);
        // console.log(this.state);
        
        this.props.deletePlaylist(this.props.id);
    }
    handleCopyToClipboardClick = () => {
        const share_link = `https://qupp.co.uk/playlist/${this.props.slug}`;
        copyToClipboard(share_link);
        navigator.clipboard.readText()
            .then(() => window.M.toast({html: `Copied to clipboard`, classes: 'green lighten-2'}))
            .catch(() => window.M.toast({html: `Error copy link, please try again`, classes: 'red lighten-2'}));
    }
    handleViewPlaylistClick = () => {
        console.log(this.props);
        this.props.history.push(`/playlist/${this.props.id}`);
        // `/playlist/${this.props.id}/${this.props.name}`
    }
    render() {
        const share_link = (this.props.share_link) ? this.props.share_link : 'GENERATE SHARE LINK' ;
        return (
            <Row>
                <Col s={8}>
                    <h5>{this.props.name}</h5>
                </Col>
                <Col s={4}>
                    <Button onClick={this.handleDeleteClick} className="right red lighten-1" waves='light'><Icon>delete</Icon></Button>
                    <Button onClick={this.handleViewPlaylistClick} className="right" waves='light'><Icon>visibility</Icon></Button>
                    <Button className="right yellow darken-3" waves='light'><Icon>edit</Icon></Button>
                </Col>
                <Col s={8}>
                    <p>https://qupp.co.uk/playlist/{this.props.slug}</p>
                </Col>
                <Col s={4}>
                    <Button onClick={this.handleCopyToClipboardClick} className="right blue" waves='light'><Icon>file_copy</Icon></Button>
                    <Button className="right pink lighten-2" waves='light'><Icon>share</Icon></Button>
                </Col>
            </Row>
        )
    }
}

PlaylistListItem.propTypes = {
    deletePlaylist: PropTypes.func.isRequired
}


export default connect(null, { deletePlaylist })(withRouter(PlaylistListItem));