import React from "react"
import { Row, Col, Button, Icon } from "react-materialize"
import { connect } from "react-redux"
import { withRouter, Link } from "react-router-dom"
import { deletePlaylist } from "../../actions/playlistActions"
import PropTypes from "prop-types"

require("dotenv").config()

const { REACT_APP_ENV } = process.env

export function PlaylistListItem(props) {
	const share_link = `${REACT_APP_ENV}/playlist/${props.slug}`

	const handleDeleteClick = () => {
		props.deletePlaylist(props.id)
	}

	const handleCopyToClipboardClick = () => {
		navigator.clipboard
			.writeText(share_link)
			.then(() =>
				window.M.toast({
					html: `Copied to clipboard`,
					classes: "green lighten-2",
				})
			)
			.catch(() =>
				window.M.toast({
					html: `Error copy link, please try again`,
					classes: "red lighten-2",
				})
			)
	}

	return (
		<Row>
			<Col s={7}>
				<h5>{props.name}</h5>
			</Col>
			<Col s={5}>
				<Button
					onClick={handleDeleteClick}
					className="right red lighten-1"
					waves="light"
				>
					<Icon>delete</Icon>
				</Button>
				<Link
					className="btn waves-effect waves-light right"
					to={`/playlist/${props.slug}`}
				>
					<Icon>visibility</Icon>
				</Link>
				<Link
					className="yellow darken-3 btn waves-effect waves-light right"
					to={`/edit-playlist/${props.slug}`}
				>
					<Icon>edit</Icon>
				</Link>
				<Button
					onClick={handleCopyToClipboardClick}
					className="right blue"
					waves="light"
				>
					<Icon>file_copy</Icon>
				</Button>
			</Col>
			<Col s={8}>
				<p>{share_link}</p>
			</Col>
		</Row>
	)
}

PlaylistListItem.propTypes = {
	deletePlaylist: PropTypes.func.isRequired,
}

export default connect(null, { deletePlaylist })(withRouter(PlaylistListItem))
