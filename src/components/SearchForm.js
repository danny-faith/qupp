import React, { Component } from 'react';
import { Row, Input, Button } from 'react-materialize';
import axios from 'axios';
// import GET_ACCESS_TOKEN from '../accessToken';
// import PropTypes from 'prop-types';

class SearchForm extends Component {
    searchQuery = React.createRef();
    componentDidMount = () => {
        // console.log('local storage', localStorage);
    }
    componentWillMount = () => {
        // in setInterval() {
        //     if (longer than an hour? == true) {
        //         get another access token
        //     } else {
        //         do nothing
        //     }
        // }
        // maybe use momentJS to tell when an hour has past
        axios.get('http://localhost:3333/authspotify')
        .then((res) => {
            localStorage.setItem('SPOTIFY_ACCESS_TOKEN', res.data.access_token);
        }); 
    }
    
    // <Input ref={this.searchQuery} placeholder="Prince I would die for you" s={6} label="Track search" />
    // <Row>
    handleFormSubmit = event => {
        event.preventDefault();
        // TODO  filter out disallowed characters ` <- that oen for starters
        // this.searchQuery.current.focus();
        const searchTerm = this.searchQuery.current.state.value;
        // console.log('this.GET_ACCESS_TOKEN(): ', this.GET_ACCESS_TOKEN());
        // var ACCESS_TOKEN = this.GET_ACCESS_TOKEN();
        // console.log(this.searchQuery.current.state.value);
        axios.get(`https://api.spotify.com/v1/search?q=${searchTerm}&type=track&limit=20`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('SPOTIFY_ACCESS_TOKEN')}`
            }
        })
        .then(res => {
            console.log('res.data: ', res.data);
            if (res.data.tracks.items === 0){
                // Materialize toast
                console.log('what the hell did you search for bro!');
                // window.Materialize.toast('I am a toast!', 10000);
                console.log('window.Materialize: ', window.Materialize);
                
                // <Toast toast="here you go!">
                //     Toast
                // </Toast>
            } else {
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
            }            
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
