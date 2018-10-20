import React, { Component } from 'react';
import { Row, Input, Button } from 'react-materialize';
import axios from 'axios';
import PropTypes from 'prop-types';

class SearchForm extends Component {
    searchQuery = React.createRef();
    componentDidMount = () => {
        
    }
    // <Input ref={this.searchQuery} placeholder="Prince I would die for you" s={6} label="Track search" />
    // <Row>
    handleFormSubmit = event => {
        event.preventDefault();
        // TODO  filter out disallowed characters ` <- that oen for starters
        // this.searchQuery.current.focus();
        const searchTerm = this.searchQuery.current.state.value
        // console.log(this.searchQuery.current.state.value);
        axios.get(`https://api.spotify.com/v1/search?q=${searchTerm}&type=track`, {
            headers: {
                'Authorization': 'Bearer BQBKSTmB13-gtF434Zo4-LovCn-dGHisZlQsbbSnJaeMzatOp6zSVQSLG2F5RWDpAgA9z8UBF5sqMD1ii5dcp5Cn8hTOEszho4syk3xp--f06Vb-xio200qsw5gae8zWVx5pdUeFGeBZ6gK373EA'
            }
        })
        .then(res => {
            console.log('first');
            
            const searchResults = res.data.tracks.items.map(song => {
                // console.log(song);
                return {
                    name: song.name,
                    album: song.album.name,
                    duration_ms: song.duration_ms,
                    spotId: song.id,
                    uri: song.uri,
                    artists: song.artists,
                    image: song.album.images[2]
                }
            });
            console.log('second');
            
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
                        <Input id={"searchInput"} defaultValue='Hello' ref={this.searchQuery} placeholder="Prince I would die for you" s={12} label="Track search" />
                    </Row>
                </form>
            </Row>
        )
    }
};

export default SearchForm;
