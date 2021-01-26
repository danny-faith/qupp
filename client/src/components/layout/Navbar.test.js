import React from 'react';
import { shallow, render, mount } from 'enzyme';
import { Navbar } from './Navbar';
// import M from "react-materialize/lib/Dropdown";
// import { Dropdown } from 'react-materialize';
import { StaticRouter } from 'react-router';

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
  
  it('should fully render correctly when user is authenticated', () => {
    const auth = {
      isAuthenticated: true,
      user: {
        avatar: ''
      }
    }
    const context = {};
    const component = mount(
      <StaticRouter context={context}>
        <Navbar
          auth={auth}
          clearPlaylists={() => {}}
          logoutUser={() => {}}
        />
      </StaticRouter>
    );
  
    expect(component).toMatchSnapshot();
  });
  
  it('WIP open dropdown when clicked when user is authenticated', () => {
    const auth = {
      isAuthenticated: true,
      user: {
        avatar: ''
      }
    }
    const context = {};
    const component = mount(
      <StaticRouter context={context}>
        <Navbar
          auth={auth}
          clearPlaylists={() => {}}
          logoutUser={() => {}}
        />
      </StaticRouter>
    );
    // component.find('.dropdown-trigger').simulate('click');
    // console.log(component.find('.dropdown-trigger').html());
    // console.log(component.find('#dropdown1').html());
    // console.log(component.html());
    // console.log('component: ', component.find('.dropdown-trigger').html());
    // expect(component).toMatchSnapshot();
  });

});
