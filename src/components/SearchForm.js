import React, { Component } from 'react';
import { Row, Input, Button } from 'react-materialize';
import axios from 'axios';
import PropTypes from 'prop-types';

class SearchForm extends Component {
    searchQuery = React.createRef();
    // <Input ref={this.searchQuery} placeholder="Prince I would die for you" s={6} label="Track search" />
    // <Row>
    handleFormSubmit = event => {
        event.preventDefault();
        // console.log(event);
        // this.searchQuery.current.focus();
        const searchTerm = this.searchQuery.current.state.value
        // console.log(this.searchQuery.current.state.value);
        axios.get(`https://api.spotify.com/v1/search?q=${searchTerm}&type=track`, {
            headers: {
                'Authorization': 'Bearer BQCH4iz_lpYRsjCih-W6vZZ7YKz-vf21s6tMB3u2zXyhG__-hbrvLpYb0YMEDq01BDiwSKmxW1kImAZ7LADhQcJOJBdcJx2TXnh2qrdTQRAHzmrN21gCVwn8xUNPap_kYl0sTYkTXEpD80hCZ08r'
            }
        })
        .then(res => {
            const persons = res.data;
            console.log(persons);
            // this.setState({ persons });
        });
    }
    render() {
        return (
            <Row>
                <form onSubmit={this.handleFormSubmit}>
                    <Button waves="light">Search</Button>
                    <Row>
                        <Input ref={this.searchQuery} placeholder="Prince I would die for you" s={12} label="Track search" />
                    </Row>
                </form>
            </Row>
        )
    }
};

export default SearchForm;
