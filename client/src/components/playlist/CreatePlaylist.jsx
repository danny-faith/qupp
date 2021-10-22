import React, { Fragment, useState, useMemo, useCallback } from "react"
import { Button } from "react-materialize"
import { createPlaylist } from "../../actions/playlistActions"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import TextFieldGroup from "../common/TextFieldGroup"

const CreatePlaylist = (props) => {
	const [name, setName] = useState(props.name || "")
	const [slug, setSlug] = useState(props.slug || "")
	const [errors, setErrors] = useState({})

	useMemo(() => {
		if (props.errors) {
			setErrors(props.errors)
		}
	}, [props.errors])

	const onSubmit = (e) => {
		e.preventDefault()
		const newPlaylist = {
			name: name,
			slug: slug,
		}
		newPlaylist.id = props.id ? props.id : null
		props.createPlaylist(newPlaylist)
	}

	const onChange = useCallback((e, setter) => {
		setErrors({})
		setter(e.target.value)
	}, [])

	return (
		<Fragment>
			<h5>{props.title}</h5>
			<form onSubmit={onSubmit}>
				<TextFieldGroup
					name="name"
					type="text"
					placeholder="Name"
					value={name}
					onChange={(e) => onChange(e, setName)}
					error={errors.name}
				/>
				<TextFieldGroup
					name="slug"
					type="text"
					placeholder="Playlist URL"
					value={slug}
					onChange={(e) => onChange(e, setSlug)}
					error={errors.slug}
					info="Please supply an easy to read URL for your playlist. No spaces, special characters or uppercase. Use underscores for spaces. E.g. daniels_party_jan"
				/>
				<Button className="right">{props.buttonText}</Button>
			</form>
		</Fragment>
	)
}

CreatePlaylist.defaultProps = {
	buttonText: "Create playlist",
}

CreatePlaylist.propTypes = {
	createPlaylist: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	name: PropTypes.string,
	slug: PropTypes.string,
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	errors: state.errors,
})

export default connect(mapStateToProps, { createPlaylist })(CreatePlaylist)
