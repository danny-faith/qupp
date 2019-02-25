import React from 'react';
import classnames from 'classnames';
import propTypes from 'prop-types';
import { Row, Col, Input } from 'react-materialize';


const TextFieldGroup = ({
    name,
    placeholder,
    value,
    label,
    error,
    info,
    type,
    onChange,
    disabled
}) => {
  return (
		<Col s={12}>
            <Input
                type={type} 
                className={classnames('form-control form-control-lg', {
                    'is-invalid': error
                })}
                placeholder={placeholder}
                label={label}
                name={name} 
                s={12}
                value={value} 
                onChange={onChange}
                disabled={disabled}
            />
            {info && (<span class="helper-text">Helper text</span>)}
            {error && (<p className="red-text col no-margin">{error}</p>)}
        </Col>
  )
}

TextFieldGroup.propTypes = {
    name: propTypes.string.isRequired,
    placeholder: propTypes.string,
    value: propTypes.string.isRequired,
    info: propTypes.string,
    error: propTypes.string,
    type: propTypes.string.isRequired,
    onChange: propTypes.func.isRequired,
    disabled: propTypes.string
}

TextFieldGroup.defaultProps = {
    type: 'text'
}

export default TextFieldGroup;