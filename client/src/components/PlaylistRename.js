import React, { Component } from 'react';
import { Row, Col, Input, Button } from 'react-materialize';
import axios from 'axios';

class PlaylistRename extends Component {
    playlistInput = React.createRef();
    playlistId = '5bdb2e61e508dc3b7e2bb325';
    /**
     * Rename playlist with value from Input within form
     * currenlty this is hardcoded to one playlist
     */
    renamePlaylistHandler = event => {
        event.preventDefault();
        axios.put(`/playlist/${this.playlistId}`, {
            name: this.playlistInput.current.state.value
        })
        .then((res) => {  
            window.M.toast({html: 'Playlist renamed', classes: 'green lighten-2'});
        });
        this.props.updatePlaylistName(this.playlistInput.current.state.value);
    }
    render() {
        return(
            <form onSubmit={this.renamePlaylistHandler}>
                <Row>
                    <Col s={10}>
                        <Input id={"playlistInput"} defaultValue={this.props.playlistName} ref={this.playlistInput} placeholder="" s={12} label="New playlist name" />
                    </Col>
                    <Col s={2}>
                        <Button icon="send" type="submit"></Button>
                    </Col>
                </Row>
            </form>
        )
    };
}

export default PlaylistRename;