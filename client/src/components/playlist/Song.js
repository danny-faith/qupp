import React, { Component } from 'react';
import { Row, Col, Button } from 'react-materialize';

export default class Song extends Component {
    componentDidMount = () => {
        const elems = document.querySelectorAll('.fixed-action-btn')
        window.M.FloatingActionButton.init(elems, {
            direction: 'left'
        });
    }

    handleAddSong = (e) => {    
        const { data } = this.props;
        const songToAdd = {
            name: data.name,
            album: data.album,
            image: data.image,
            artists: data.artists,
            spotId: data.spotId,
            duration_ms: data.duration_ms,
            uri: data.uri
        }
        this.props.addSongToQueueOrQupplistHandler(songToAdd, e.currentTarget.dataset.type)
    }

    handleRemoveSong = (e) => {
        this.props.removeSongFromQueueOrPlaylist(this.props.index, e.currentTarget.dataset.type)
    }

    createActionButton = ({ dataType, classNames, icon, action }) => (
        <Button
            onClick={action}
            data-type={dataType}
            floating icon={icon}
            className={classNames}
        />
    )

    buttonDecider = (type) => {
        switch (type) {
            case 'search':
                return (
                    <Button ref={this.myRef} floating fab='horizontal' icon='more_horiz' className='pink' large style={{bottom: '0px', right: '0px'}}>
                        {this.createActionButton({ dataType: 'qupplist', icon: 'playlist_add', classNames: 'blue', action: this.handleAddSong })}
                        {this.createActionButton({ dataType: 'queue', icon: 'playlist_add', classNames: 'yellow darken-1', action: this.handleAddSong })}
                    </Button>
                )
            case 'qupplist':
                return (
                <Button ref={this.myRef} floating fab='horizontal' icon='more_horiz' className='pink' large style={{bottom: '0px', right: '0px'}}>
                    {this.createActionButton({ dataType: 'qupplist', icon: 'delete', classNames: 'red darken-1', action: this.handleRemoveSong })}
                    {this.createActionButton({ dataType: 'queue', icon: 'playlist_add', classNames: 'yellow darken-1', action: this.handleAddSong })}
                </Button>
            )
            case 'queue':
                return (
                <Button ref={this.myRef} floating fab='horizontal' icon='more_horiz' className='pink' large style={{bottom: '0px', right: '0px'}}>
                    {this.createActionButton({ dataType: 'queue', icon: 'delete', classNames: 'red darken-1', action: this.handleRemoveSong })}
                    {this.createActionButton({ dataType: 'qupplist', icon: 'playlist_add', classNames: 'blue darken-1', action: this.handleAddSong })}
                </Button>
            )
            default:
                break
        }
    }
            
            
    render () {
        const { type, colour, data } = this.props
        const songButtons = this.buttonDecider(type)

        return (
            <Row className={`${colour} py-3 darken-2 mb-0`}>
                <Col s={2} className="">
                    <img alt="Song cover" src={data.image} className="w-full block" />
                </Col>
                <Col s={8} className="pl-0">
                    <p className="my-0">{data.name}, {data.album}, Artists: 
                        {data.artists.map(key => (
                            <span key={key.name}> {key.name}</span>
                        ))}
                    </p>
                </Col>
                <Col s={2} className="pl-0 relative">
                    {songButtons}
                </Col>
            </Row>
        )
    }
}
