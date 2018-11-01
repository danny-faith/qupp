import React, { Component } from 'react';
import { Row, Col, Input, Button } from 'react-materialize';
import axios from 'axios';

class PlaylistRename extends Component {
    playlistInput = React.createRef();
    playlistId = '5bdb2e61e508dc3b7e2bb325';
    renamePlaylistHandler = event => {
        event.preventDefault();
        axios.put(`http://localhost:8080/playlist/${this.playlistId}`, {
            name: this.playlistInput.current.state.value
        }).then((res) => {
            console.log('res: ', res);            
        });
        this.props.updatePlaylistName(this.playlistInput.current.state.value);
    }
    render() {
        return(
            <form onSubmit={this.renamePlaylistHandler}>
                <Input id={"playlistInput"} defaultValue={this.props.playlistName} ref={this.playlistInput} placeholder="" s={12} label="New playlist name" />
                <Button icon="send" type="submit"></Button>
            </form>
        )
    };
}

export default PlaylistRename;