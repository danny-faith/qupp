import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-materialize';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ChangePassword from '../components/auth/ChangePassword';
import UploadAvatar from '../components/account/UploadAvatar';

class MyAccountPage extends Component {
    componentDidMount = () => {
        if (!this.props.auth.isAuthenticated) {
            this.props.history.push('/login');
        }
    }
    componentWillReceiveProps = (nextProps) => {
        if (!nextProps.auth.isAuthenticated) {
            this.props.history.push('/login');
        }
        if (nextProps.errors) {
            this.setState({errors: nextProps.errors});
        }
    }
    render() {
        return (
            <div>
                <Row>
                    <Col s={12}>
                        <h1>My account</h1>
                    </Col>
                    <Col s={12} m={6}>
                        <h2>Update password</h2>
                        <ChangePassword endpoint="" />
                    </Col>
                    <Col s={12} m={6}>
                        <h2>Upload avatar</h2>
                        <UploadAvatar endpoint="" />
                    </Col>
                </Row>
            </div>
        )
    }
}

MyAccountPage.propTypes = {
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	errors: state.errors
});

export default connect(mapStateToProps)(withRouter(MyAccountPage));