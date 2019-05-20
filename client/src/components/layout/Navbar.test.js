import React from 'react';
import { shallow, render, mount } from 'enzyme';
import { Navbar } from './Navbar';

describe('Navbar component', () => {
  beforeAll(() => {
    const object = {
      value: jest.fn(() => { return { matches: true } })
    };
    Object.defineProperty(window, "M", object);
    Object.defineProperty(window.M, "Dropdown", object);
    Object.defineProperty(window.M.Dropdown, "init", object);
  });
  let wrapper;
  const auth = {
      isAuthenticated: true,
      user: {
        avatar: ''
      }
  }
  beforeEach(() => {
      wrapper = shallow(
      <Navbar
        auth={auth}
        clearPlaylists={() => {}}
        logoutUser={() => {}}
      />)
  });


  it('should shallow render correctly when user is not authenticated', () => {
    const auth = {
      isAuthenticated: false,
      user: {
        avatar: ''
      }
    }
    const component = shallow(
      <Navbar
        auth={auth}
        clearPlaylists={() => {}}
        logoutUser={() => {}}
      />
    );
  
    expect(component).toMatchSnapshot();
  });
  
  it('should shallow render correctly when user is authenticated', () => {
    const auth = {
      isAuthenticated: true,
      user: {
        avatar: ''
      }
    }
    const component = shallow(
      <Navbar
        auth={auth}
        clearPlaylists={() => {}}
        logoutUser={() => {}}
      />
    );
  
    expect(component).toMatchSnapshot();
  });

});
