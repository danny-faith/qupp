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
		<React.Fragment>
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
            {error && (<p className="red-text col s12 no-margin">{error}</p>)}
            {info && (<p className="helper-text col s12">{info}</p>)}
        </React.Fragment>
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