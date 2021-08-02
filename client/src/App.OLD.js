// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';

// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<App />, div);
//   ReactDOM.unmountComponentAtNode(div);
// });

import React from 'react';
import { shallow, render, mount } from 'enzyme';
import App from './App';

describe('App shallow', () => {
  it('should render correctly in "debug" mode', () => {
    const component = shallow(<App debug />);
  
    expect(component).toMatchSnapshot();
  });
});