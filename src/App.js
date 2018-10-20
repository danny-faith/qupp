import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import SearchForm from './components/SearchForm';
import logo from './logo.svg';
import './App.scss';

class App extends Component {
  render() {
    return (
      <>
        <Row>
          <Col s={12} className='center'><h1>qupp</h1></Col>
        </Row>
        <Row>
          <Col s={4} className='grid-example center'>
            <h3>Playlist</h3>
          </Col>
          <Col s={4} className='grid-example center'>
            <h3>Search</h3>
            <SearchForm />
          </Col>
          <Col s={4} className='grid-example center'>
            <h3>Player</h3>
          </Col>
        </Row>
      </>
    );
  }
}

export default App;
