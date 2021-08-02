import React, { useState, useMemo, useEffect } from 'react'
import { Row, Col, Button } from 'react-materialize'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { changePassword } from '../../actions/authActions'
import TextFieldGroup from '../common/TextFieldGroup'

export function ChangePassword (props) {
	const [formValues, setFormValues] = useState({
		password: '',
		password2: '',
	})
	const [errors, setErrors] = useState({})

	const onChange = e => {
        setFormValues({...formValues, [e.target.name]: e.target.value })
	}

  	const onSubmit = e => {
    	e.preventDefault()
		console.log(props)
	
		const payload = {
			isAuthenticated: props.auth.isAuthenticated,
			token: props.location.search.replace('?', '').split('=')[1],
			userId: props.auth.user.id,
			password: formValues.password,
			password2: formValues.password2
		}
    	props.changePassword(payload)
	}

    useEffect(() => {
        if (props.auth.passwordUpdated && props.auth.passwordUpdated.status === 'success') {
            setFormValues({
                password: '',
                password2: '',
            })
        }
    }, [props.auth])

	useMemo(() => {
		if (props.errors) {
            setErrors(props.errors)
		}
	}, [props.errors])

	return (
		<form noValidate onSubmit={onSubmit}>
			<Row>
				<Col s={12}>
					<TextFieldGroup
						placeholder="New password"
						name="password"
						type="password"
						value={formValues.password}
						onChange={onChange}
						error={errors.password}
					/>
				</Col>
			</Row>
			<Row>
				<Col s={12}>
					<TextFieldGroup
						placeholder="Confirm new password"
						name="password2"
						type="password"
						value={formValues.password2}
						onChange={onChange}
						error={errors.password2}
					/>
				</Col>
			</Row>
			<Row>
				<Col s={12}>
					<Button className="btn-small right" waves="light">Update password</Button>
				</Col>
			</Row>
		</form>
	)
}

ChangePassword.propTypes = {
	changePassword: PropTypes.func.isRequired,
  	auth: PropTypes.object.isRequired,
  	errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	errors: state.errors
})

export default connect(mapStateToProps,  { changePassword })(withRouter(ChangePassword))