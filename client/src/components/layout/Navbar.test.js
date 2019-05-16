import React from 'react';
import { shallow, render, mount } from 'enzyme';
import { Navbar } from './Navbar';

describe('Navbar shallow', () => {
  it('should render correctly', () => {
    const component = shallow(<Navbar />);
  
    expect(component).toMatchSnapshot();
  });
});

// describe('Navbar render', () => {
//   it('should render correctly', () => {
//     const component = render(<Navbar isAuthenticated="true" />);
  
//     expect(component).dive().toMatchSnapshot();
//   });
// });

// describe('Examining the syntax of Jest tests', () => {
   
//     it('sums numbers', () => {
//         expect(1 + 2).toEqual(3);
//         expect(2 + 2).toEqual(4);
//     });
// });

// import React from 'react';
// import { render, cleanup} from 'react-testing-library';
// import 'jest-dom/extend-expect';
// import Navbar from './Navbar';

// it('renders Navbar', () => {
//     const { asFragment } = render(<Navbar />).dive();
//     expect(asFragment()).toMatchSnapshot();
// });