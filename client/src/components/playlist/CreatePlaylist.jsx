import React, { Fragment, useState, useMemo } from "react"
import { Button } from "react-materialize"
import { createPlaylist } from "../../actions/playlistActions"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import TextFieldGroup from "../common/TextFieldGroup"

function CreatePlaylist(props) {
	const [values, setValues] = useState({
		name: props.name || "",
		slug: props.slug || "",
	})
	const [errors, setErrors] = useState({})

	useMemo(() => {
		if (props.errors) {
			setErrors(props.errors)
		}
	}, [props.errors])

	const onSubmit = (e) => {
		e.preventDefault()
		const newPlaylist = {
			name: values.name,
			slug: values.slug,
		}
		newPlaylist.id = props.id ? props.id : null
		props.createPlaylist(newPlaylist)
	}

	const onChange = (e) => {
		setErrors({})
		setValues({ ...values, [e.target.name]: e.target.value })
	}

	return (
		<Fragment>
			<h5>{props.title}</h5>
			<form onSubmit={onSubmit}>
				<TextFieldGroup
					name="name"
					type="text"
					placeholder="Name"
					value={values.name}
					onChange={onChange}
					error={errors.name}
				/>
				<TextFieldGroup
					name="slug"
					type="text"
					placeholder="Playlist URL"
					value={values.slug}
					onChange={onChange}
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
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	errors: state.errors,
})

export default connect(mapStateToProps, { createPlaylist })(CreatePlaylist)
