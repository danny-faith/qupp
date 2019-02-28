import React, { Component } from 'react';
import { Row, Col, Button, Icon } from 'react-materialize';
import { connect } from 'react-redux';
import { deletePlaylist } from '../actions/playlistActions';
import PropTypes from 'prop-types';

class PlaylistListItem extends Component {
    handleDeleteClick = () => { 
        console.log(this.props);
        // console.log(this.state);
        
        this.props.deletePlaylist(this.props.id);
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
                    <Button className="right" waves='light'><Icon>visibility</Icon></Button>
                    <Button className="right yellow darken-3" waves='light'><Icon>edit</Icon></Button>
                </Col>
                <Col s={8}>
                    <h5>{share_link}</h5>
                </Col>
                <Col s={4}>
                    <Button className="right blue" waves='light'><Icon>file_copy</Icon></Button>
                    <Button className="right pink lighten-2" waves='light'><Icon>share</Icon></Button>
                </Col>
            </Row>
        )
    }
}

PlaylistListItem.propTypes = {
    deletePlaylist: PropTypes.func.isRequired
}


export default connect(null, { deletePlaylist })(PlaylistListItem);