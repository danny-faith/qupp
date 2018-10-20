import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import SearchForm from './components/SearchForm';
import SearchResultItem from './components/SearchResultItem';
import logo from './logo.svg';
import './App.scss';

class App extends Component {
  state = {
    searchResults: [],
    playList: []
  }
  addSearchResultsToState = (results) => {
    console.log('results from App.js: ', results);
    this.setState((prevState) => ({
      searchResults: results
    }));
    console.log(this.state);    
  }
  render() {
    return (
      <>
        <Row>
          <Col s={12} className='center'><h1>qupp</h1></Col>
        </Row>
        <Row>
          <Col s={4} className='grid-example'>
            <h3 className="center">Playlist</h3>
          </Col>
          <Col s={4} className='grid-example'>
            <h3 className="center">Search</h3>
            <SearchForm addSearchResultsToState={this.addSearchResultsToState} />
            {Object.keys(this.state.searchResults).map(key => {

                console.log('hello');
                return <SearchResultItem data={this.state.searchResults[key]} key={key} />
            })}
          </Col>
          <Col s={4} className='grid-example'>
            <h3 className="center">Player</h3>
          </Col>
        </Row>
      </>
    );
  }
}

export default App;
