import React, { Component } from 'react';
import { Row, Col, Input, Button } from 'react-materialize';
import axios from 'axios';
// import PropTypes from 'prop-types';

class SearchForm extends Component {
    searchQuery = React.createRef();
    componentWillMount = () => {
        // maybe use momentJS to tell when an hour has past
        axios.get('http://localhost:8080/authspotify')
        .then((res) => {
            localStorage.setItem('SPOTIFY_ACCESS_TOKEN', res.data.access_token);
        }); 
    }
    
    handleFormSubmit = event => {
        event.preventDefault();
        // TODO  filter out disallowed characters ` <- that oen for starters

        const searchTerm = this.searchQuery.current.state.value;

        axios.get(`https://api.spotify.com/v1/search?q=${searchTerm}&type=track&limit=20`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('SPOTIFY_ACCESS_TOKEN')}`
            }
        })
        .then(res => {
            if (res.data.tracks.items.length === 0) {
                window.M.toast({html: 'No tracks found!', classes: 'red lighten-2'});
            } else {
                const searchResults = res.data.tracks.items.map(song => {

                    let image = '';
                    
                    if (song.album.images[2] === undefined) {
                        image = 'http://placehold.it/64x64';
                    } else {
                        image = song.album.images[2].url;
                    }
                    return {
                        name: song.name,
                        album: song.album.name,
                        duration_ms: song.duration_ms,
                        spotId: song.id,
                        uri: song.uri,
                        artists: song.artists,
                        image: image
                    }
                });

                this.props.addSearchResultsToState(searchResults);
            }            
        });
    }
    render() {
        return (
            <Row>
                <form onSubmit={this.handleFormSubmit}>
                    <Row>
                        <Col s={8} offset={"s1"}>
                            <Input id={"searchInput"} defaultValue='hello' ref={this.searchQuery} placeholder="Prince I would die for you" s={12} label="Track search" />
                        </Col>
                        <Col s={2}>
                            <Button className="left" waves="light">Search</Button>
                        </Col>
                    </Row>
                </form>
            </Row>
        )
    }
};

export default SearchForm;
