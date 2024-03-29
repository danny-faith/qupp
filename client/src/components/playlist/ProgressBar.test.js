import React from "react"
import { shallow, render, mount } from "enzyme"
import ProgressBar from "./ProgressBar"

describe("Progress shallow", () => {
	it('should render correctly in "debug" mode', () => {
		const component = shallow(<ProgressBar debug />)

		expect(component).toMatchSnapshot()
	})
})

describe("Progress render", () => {
	it('should render correctly in "debug" mode', () => {
		const component = render(<ProgressBar debug />)

		expect(component).toMatchSnapshot()
	})
})
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
