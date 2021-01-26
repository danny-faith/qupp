import React, { Component, Fragment } from 'react';
import { Button } from 'react-materialize';
import { createPlaylist } from '../../actions/playlistActions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextFieldGroup from '../common/TextFieldGroup';

export class CreatePlaylist extends Component {
    state = {
        name: this.props.name || '',
        slug: this.props.slug || '',
        errors: {}
    }
    onSubmit = (e) => {
        e.preventDefault();
        const newPlaylist = {
            name: this.state.name,
            slug: this.state.slug
        }
        newPlaylist.id = (this.props.id) ? this.props.id : null;
        this.props.createPlaylist(newPlaylist);
    }
    onChange = (e) => {        
        const errors = this.state.errors;
		errors[e.target.name] = '';
		this.setState({
			[e.target.name]: e.target.value,
			errors
		});
	};
	componentWillReceiveProps = nextProps => {
		if (nextProps.errors) {
			this.setState({ errors: nextProps.errors });
		}
	};
	render() {
		const { errors } = this.state;

		return (
			<Fragment>
				<h5>{this.props.title}</h5>
				<form onSubmit={this.onSubmit}>
					<TextFieldGroup
						name="name"
						type="text"
						placeholder="Name"
						value={this.state.name}
						onChange={this.onChange}
						error={errors.name}
					/>
					<TextFieldGroup
						name="slug"
						type="text"
						placeholder="Playlist URL"
						value={this.state.slug}
						onChange={this.onChange}
						error={errors.slug}
						info="Please supply an easy to read URL for your playlist. No spaces, special characters or uppercase. Use underscores for spaces. E.g. daniels_party_jan"
					/>
					<Button className="right">{this.props.buttonText}</Button>
				</form>
			</Fragment>
		);
	}
}

CreatePlaylist.defaultProps = {
	buttonText: 'Create playlist'
};

CreatePlaylist.propTypes = {
	createPlaylist: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors
});

export default connect(
	mapStateToProps,
	{ createPlaylist }
)(CreatePlaylist);
