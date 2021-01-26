import React from 'react';
import { shallow, render, mount } from 'enzyme';
import { Login } from './Login';

describe('Login component', () => {
    let wrapper;
    const mockLoginUserfn = jest.fn();
    const auth = {
        isAuthenticated: true,
    }
    beforeEach(() => {
        wrapper = shallow(
        <Login
            loginUser={mockLoginUserfn} 
            auth={auth}
            errors={{}}
            history={[]}
        />)
    });

    
    it('should shallow render correctly', () => {
        const auth = {
            isAuthenticated: false,
        }
        const loginUser = jest.fn();
        const component = shallow(
            <Login
                auth={auth}
                loginUser={loginUser}
                errors={{}}
                history={[]}
            />
          );
          expect(component).toMatchSnapshot();
    });
    
    describe('When the form is submitted', () => {
        it('should call the mock login function', () => {
        // Ok to use `form` as a selector as there is only one form within the component
         wrapper.find('form').simulate(
            'submit', 
            {preventDefault() {}}
        );
        expect(mockLoginUserfn.mock.calls.length).toBe(1)
        })
    });

    it('should be called with the email and password in the state as arguments', () => {
        // fill in email field with blah@gmail.com     
        wrapper.find('[name="usernameOrEmail"]').simulate(
          'change', 
          {target: 
            {name: 'usernameOrEmail', value: 'blah@gmail.com'}
          }
        )
        // fill in password field with cats  
        wrapper.find('[name="password"]').simulate(
          'change', 
          {target: 
             {name: 'password', value: 'cats'}
          }
        )
        // simulate form submission   
        // Ok to use `form` as a selector as there is only one form within the component
        wrapper.find('form').simulate(
          'submit', 
          {preventDefault() {}}
        )
        // test to see arguments used after its been submitted 
        expect(mockLoginUserfn.mock.calls[1][0]).toEqual(
          {usernameOrEmail: 'blah@gmail.com', password: 'cats'}
        )
    });
});