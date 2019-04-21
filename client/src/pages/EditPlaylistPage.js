import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-materialize';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import TextFieldGroup from '../components/common/TextFieldGroup';

class EditPlaylist extends Component {
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
        <h1>Edit playlist</h1>
        <Row>
          <Col s={6} className="offset-s3">
            <form noValidate onSubmit={this.onSubmit}>
              <Row>
                <Col s={12}>
                  <TextFieldGroup
                    placeholder="Email address"
                    name="email"
                    type="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    error={errors.email}
                  />
                  {errors.email && (<p className="red-text col no-margin">{errors.email}</p>)}
                </Col>
              </Row>
            </form>
          </Col>
        </Row>
      </div>
    )
  }
}
EditPlaylist.propTypes = {
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	errors: state.errors
});

export default connect(mapStateToProps)(withRouter(EditPlaylist));