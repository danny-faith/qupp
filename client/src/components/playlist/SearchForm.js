import React, { useState, useEffect } from 'react'
import { Row, Col, Button } from 'react-materialize'
import TextFieldGroup from '../common/TextFieldGroup'
// import PropTypes from 'prop-types'
import axios from 'axios'

function SearchForm(props) {
    const [search, setSearch] = useState('')
    const [errors, setErrors] = useState('')
    const regex = /[`'#]/g

    const handleInputOnChange = (event) => {
        /**
         * Checking input value everytime time a new character is entered
         * for special characters defined in above `regex`.
         * IF special characters are found alert the user using Mat' Toast
         */
        let search = event.target.value
        const found = search.match(regex) || []
        
        if (found.length === 0) {
            setSearch(search)
        } else {
            window.M.toast({html: 'Please do not use special characters( ` \'# ) when searching', 'displayLength': 6000, classes: 'red lighten-1'})
        }
    }

    useEffect(() => {
        /**
         * When component mounts, make call to Spotify to get access token
         * in order to perform the search.
         * This is a terrible way to manage the access token and 
         * will not be in the final version of this project
         */
        axios.get('/api/authspotify')
            .then((res) => {
                localStorage.setItem('SPOTIFY_ACCESS_TOKEN', res.data.access_token)
            })
            .catch(err => console.log(err)) 
    }, [])
    
    const handleFormSubmit = (event) => {
        event.preventDefault()

        if (search === '') {
            return window.M.toast({html: 'Please enter a search term', classes: 'red lighten-1'})
        }

        /**
         * Search Spotify using search term from Input
         */
        axios.get(`https://api.spotify.com/v1/search?q=${search}&type=track&limit=20`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('SPOTIFY_ACCESS_TOKEN')}`
            }
        })
        .then(res => {
            if (res.data.tracks.items.length === 0) { 
                /**
                 * if no tracks found alert user with Mat' Toast
                 * else create array of search results and add to state so they can be rendered
                 */
                window.M.toast({html: 'No tracks found!', classes: 'red lighten-1'})
            } else {
                /**
                 * map over the array of tracks returned by Spotify and create an array of objects
                 * containing the properties needed from each track defined in the song schema.
                 */
                const searchResults = res.data.tracks.items.map(song => {

                    let image = ''
                    
                    if (song.album.images[2] === undefined) {
                        image = 'http://placehold.it/64x64'
                    } else {
                        image = song.album.images[2].url
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
                })

                /**
                 * Send the array of search results back up to app.js to be added to state.searchResults and rendered
                 */
                props.addSearchResultsToState(searchResults)
            }            
        })
    }

    return (
        <Row>
            <form onSubmit={handleFormSubmit}>
                <Row>
                    <Col s={9}>
                        <TextFieldGroup
                            name="search"
                            type="text"
                            label="What would you like to listen to?"
                            value={search}
                            onChange={handleInputOnChange}
                            error={errors.name}
                        />
                    </Col>
                    <Col s={2}>
                        <Button className="left" waves="light">Search</Button>
                    </Col>
                </Row>
            </form>
        </Row>
    )
}

export default SearchForm
