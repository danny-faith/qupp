import React, { useState, useEffect } from "react"
import { Row, Col, Button } from "react-materialize"
import TextFieldGroup from "../common/TextFieldGroup"
import axios from "axios"

function SearchForm(props) {
	const [search, setSearch] = useState("")
	const [errors, setErrors] = useState("")
	const regex = /[`'#]/g

	const handleInputOnChange = (event) => {
		let search = event.target.value
		const found = search.match(regex) || []

		if (found.length === 0) {
			setSearch(search)
		} else {
			setErrors({
				characters:
					"Please do not use special characters( ` '# ) when searching",
			})
			window.M.toast({
				html: "Please do not use special characters( ` '# ) when searching",
				displayLength: 6000,
				classes: "red lighten-1",
			})
		}
	}

	useEffect(() => {
		axios
			.get("/api/authspotify")
			.then((res) => {
				localStorage.setItem(
					"SPOTIFY_ACCESS_TOKEN",
					res.data.access_token
				)
			})
			.catch((err) => console.log(err))
	}, [])

	const handleFormSubmit = (event) => {
		event.preventDefault()

		if (search === "") {
			return window.M.toast({
				html: "Please enter a search term",
				classes: "red lighten-1",
			})
		}

		axios
			.get(
				`https://api.spotify.com/v1/search?q=${search}&type=track&limit=20`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							"SPOTIFY_ACCESS_TOKEN"
						)}`,
					},
				}
			)
			.then((res) => {
				if (res.data.tracks.items.length === 0) {
					window.M.toast({
						html: "No tracks found!",
						classes: "red lighten-1",
					})
				} else {
					const searchResults = res.data.tracks.items.map((song) => {
						let image = ""

						if (song.album.images[2] === undefined) {
							image = "http://placehold.it/64x64"
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
							image: image,
						}
					})

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
							error={errors.characters}
						/>
					</Col>
					<Col s={2}>
						<Button className="left" waves="light">
							Search
						</Button>
					</Col>
				</Row>
			</form>
		</Row>
	)
}

export default SearchForm
