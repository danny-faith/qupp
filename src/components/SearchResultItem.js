import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import PropTypes from 'prop-types';

const SearchResultItem = (props) => {
//   <p>Artists:<br/>
//   {props.data.ingredients.map(key => (
//     <span key={key}>{key}</span>
//   ))}
// </p>
return(
  <Row>
    <Col s={2} className=''>
      <img src={props.data.image.url} />
    </Col>
    <Col s={10} className=''>
      {props.data.name}
    </Col>
  </Row>
);
}
  
  export default SearchResultItem;