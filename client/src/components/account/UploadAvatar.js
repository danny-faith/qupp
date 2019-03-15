import React, { Component, Fragment, useEffect } from 'react';
import Dropzone from 'react-dropzone';
import classNames from "classnames";
import { Button } from 'react-materialize';
import { uploadAvatarImage } from '../../actions/authActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class UploadAvatar extends Component {
    constructor() {
        super();
        this.state = {
            preview: '',
            formData:''
        }
        this.maxFileSize = 1024 * 1024 * 4; // 4MB
        this.avatarPreview = '';
    }

    onDrop = (acceptedFiles, rejectedFiles) => {
        const errors = {};
        const formData = new FormData();
        formData.append('avatar', acceptedFiles[0]);
        // console.log(acceptedFiles);
        // Create avatar preview
        this.avatarPreview = URL.createObjectURL(acceptedFiles[0]);
        // console.log(this.avatarPreview);
        
        this.setState({ preview: this.avatarPreview});
        
        if (rejectedFiles.length > 0) {
            if (rejectedFiles[0].size > this.maxFileSize) {
                errors.fileSize = 'File size too large';
            }
            if (
                rejectedFiles[0].type !== 'image/jpeg' ||
                rejectedFiles[0].type !== 'image/png' ||
                rejectedFiles[0].type !== 'image/gif') {
                errors.mimeType = 'File rejected - .jpg, .png, .gif only';
            }
            return Object.keys(errors).map(key => window.M.toast({html: errors[key], classes: 'red lighten-1'}))  
        }
        this.setState({ formData });
    };
    submitAvatar = () => {
        this.props.uploadAvatarImage(this.state.formData);
    }
    componentWillUnmount = () => {
        // Remove ObjectURL to prevent memory leaks
        URL.revokeObjectURL(this.avatarPreview);
    };
  render() {
    return (
        <Fragment>
            <p>Max file size: 3MB</p>
            <p>Recommened file dimensions: 300px x 300px</p>
            <p>File types: JPG, PNG and GIFs</p>
            <p>NOTE: Uploading an avatar will override Gravatar</p>
            {(this.state.preview && (
                <div style={{backgroundImage: `url(${this.state.preview}`}} className="avatar-preview-image overflow-hidden my-6 mx-auto block rounded-full">
                </div>
                )
            )}
            <Dropzone
                accept=".jpg,.png,.gif"
                onDrop={this.onDrop}
                maxSize={this.maxFileSize}
                multiple={false}
            >
                {({ getRootProps, getInputProps, isDragActive }) => {
                return (
                    <div
                    {...getRootProps()}
                    className={classNames("dropzone", {
                        "dropzone--isActive": isDragActive
                    })}
                    >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p>Drop files here...</p>
                    ) : (
                        <p>
                        Try dropping some files here, or click to select files to
                        upload.
                        </p>
                    )}
                    </div>
                );
                }}
            </Dropzone>
			<Button onClick={this.submitAvatar} className="btn-small right mt-4" waves="light">Submit</Button>
        </Fragment>
    )
  }
}

UploadAvatar.propTypes = {
	uploadAvatarImage: PropTypes.func.isRequired
};

export default connect(null, {uploadAvatarImage})(UploadAvatar);