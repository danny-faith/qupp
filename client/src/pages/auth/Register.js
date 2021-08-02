import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Button } from 'react-materialize'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { registerUser } from '../../actions/authActions'
import TextFieldGroup from '../../components/common/TextFieldGroup'

export function Register(props) {
	const [formValues, setFormValues] = useState({
		username: '',
		email: '',
		password: '',
		password2: '',
	})
	const [errors, setErrors] = useState({})

	const onChange = e => {
		setFormValues({...formValues, [e.target.name]: e.target.value})
		setErrors(errors)
	}

	const onSubmit = e => {
		e.preventDefault()
		const newUser = {
			username: formValues.username,
			email: formValues.email,
			password: formValues.password,
			password2: formValues.password2
		}
		props.registerUser(newUser, props.history)
	}

	useEffect(() => {
		if (props.auth.isAuthenticated) {
			props.history.push('/dashboard')
		}
	}, [])

	useMemo(() => {
		if (props.auth.isAuthenticated) {
			props.history.push('/dashboard')
		}
		setErrors(props.errors)
	}, [props.errors])

	return (
		<Row>
			<Col s={6} className="offset-s3">
				<h1 className="center">Register</h1>
				<form noValidate onSubmit={onSubmit}>
					<Row>
						<TextFieldGroup
							name="email"
							type="email"
							label="Email"
							value={formValues.email}
							onChange={onChange}
							error={errors.email}
						/>
						<TextFieldGroup
							name="username"
							label="Username"
							value={formValues.username}
							onChange={onChange}
							error={errors.username}
						/>
						<TextFieldGroup
							name="password"
							type="password"
							label="Password"
							value={formValues.password}
							onChange={onChange}
							error={errors.password}
						/>
						<TextFieldGroup
							name="password2"
							type="password"
							label="Confirm password"
							value={formValues.password2}
							onChange={onChange}
							error={errors.password2}
						/>
					</Row>
					<Row>
						<Col s={12}>
							<Button className="btn-small right" waves="light">Register</Button>
						</Col>
					</Row>
				</form>
			</Col>
		</Row>
		)
}

Register.propTypes = {
	registerUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	errors: state.errors
})

export default connect(mapStateToProps, {registerUser })(withRouter(Register))