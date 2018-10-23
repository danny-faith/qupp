import React, { Component } from 'react';
import { Row, Input, Button } from 'react-materialize';
import axios from 'axios';
import PropTypes from 'prop-types';

class SearchForm extends Component {
    searchQuery = React.createRef();
    componentDidMount = () => {
        console.log('SearchForm componentDidMount');
    }
    // <Input ref={this.searchQuery} placeholder="Prince I would die for you" s={6} label="Track search" />
    // <Row>
    handleFormSubmit = event => {
        event.preventDefault();
        // TODO  filter out disallowed characters ` <- that oen for starters
        // this.searchQuery.current.focus();
        const searchTerm = this.searchQuery.current.state.value
        // console.log(this.searchQuery.current.state.value);
        axios.get(`https://api.spotify.com/v1/search?q=${searchTerm}&type=track&limit=16`, {
            headers: {
                'Authorization': 'Bearer BQCa8TrmbfkAII94-383QCsAinTr_zboaMmshx3H-6MBPIifMRp0hoqwCdFFq-ky7LOiCaJoSuBmhKlGEWIMB1jYnWbR-1v7eHesaNTt5xIh8gnpXH2NmUEC0kkM2wlHulgQ3mz4kQwZ0DjqyBbh'
            }
        })
        .then(res => {
            
            const searchResults = res.data.tracks.items.map(song => {
                // console.log(song);
                // const image = (song.album.images[2].url) ? song.album.images[2].url : 'http://placehold.it/64x64';
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
            
            // console.log('hello??', res.data.tracks.items);
            // console.log('searchResults: ', searchResults);
            
            this.props.addSearchResultsToState(searchResults);
            
        });
    }
    render() {
        return (
            <Row>
                <form onSubmit={this.handleFormSubmit}>
                    <Button waves="light">Search</Button>
                    <Row>
                        <Input id={"searchInput"} defaultValue='when doves cry' ref={this.searchQuery} placeholder="Prince I would die for you" s={12} label="Track search" />
                    </Row>
                </form>
            </Row>
        )
    }
};

export default SearchForm;
