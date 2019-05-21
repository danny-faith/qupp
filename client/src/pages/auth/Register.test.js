import React from 'react';
import { shallow, render, mount } from 'enzyme';
import { Register } from './Register';

describe('Register component', () => {
    let wrapper;
    const mockRegisterUserfn = jest.fn();
    const auth = {
        isAuthenticated: true,
    }
    beforeEach(() => {
        wrapper = shallow(
        <Register
            registerUser={mockRegisterUserfn} 
            auth={auth}
            errors={{}}
            history={[]}
        />)
    });

    
    it('should shallow render(Shallow rendering) correctly', () => {
        const auth = {
            isAuthenticated: false,
        }
        const mockRegisterUserfn = jest.fn();
        const component = shallow(
            <Register
                auth={auth}
                registerUser={mockRegisterUserfn}
                errors={{}}
                history={[]}
            />
        );
        expect(component).toMatchSnapshot();
    });
    
    it('should fully render(Full DOM) correctly', () => {
        const auth = {
            isAuthenticated: false,
        }
        const mockRegisterUserfn = jest.fn();
        const component = mount(
            <Register
                auth={auth}
                registerUser={mockRegisterUserfn}
                errors={{}}
                history={[]}
            />
        );
        expect(component).toMatchSnapshot();
    });
    
    it('should fully render(static render) correctly', () => {
        const auth = {
            isAuthenticated: false,
        }
        const mockRegisterUserfn = jest.fn();
        const component = render(
            <Register
                auth={auth}
                registerUser={mockRegisterUserfn}
                errors={{}}
                history={[]}
            />
        );
        expect(component).toMatchSnapshot();
    });

    describe("Register inputs - ", () => {
        test("email input shows the expected text when user enters text", () => {
            const wrapper = mount(
                <Register 
                    auth={auth}
                    registerUser={mockRegisterUserfn}
                    errors={{}}
                    history={[]}
                />
            );
            wrapper.find('#email').at(1).simulate('change', 
                {target: 
                    {name: 'email', value: 'users-email@email.com'}
                }
            );
            const emailText = wrapper.find('#email').at(1).html();
            
            expect(emailText).toEqual(expect.stringContaining('users-email@email.com'));
        });
        test("username input shows the expected text when user enters text", () => {
            const wrapper = mount(
                <Register 
                    auth={auth}
                    registerUser={mockRegisterUserfn}
                    errors={{}}
                    history={[]}
                />
            );
            wrapper.find('#username').at(1).simulate('change', 
                {target: 
                    {name: 'username', value: 'users-username'}
                }
            );
            const usernameText = wrapper.find('#username').at(1).html();
            
            expect(usernameText).toEqual(expect.stringContaining('users-username'));
        });
    });
    
    describe('When the form is submitted', () => {
        it('should call the mock login function', () => {
        // Ok to use `form` as a selector as there is only one form within the component
         wrapper.find('form').simulate(
            'submit', 
            {preventDefault() {}}
        );
        expect(mockRegisterUserfn.mock.calls.length).toBe(1)
        })
    });

    it('should be called with the email, username, password and password2 in the state as arguments', () => {
        // fill in email field with blah@gmail.com     
        wrapper.find('[name="email"]').simulate(
          'change', 
          {target: 
            {name: 'email', value: 'blah@gmail.com'}
          }
        )
        // fill in username field with blah@gmail.com     
        wrapper.find('[name="username"]').simulate(
          'change', 
          {target: 
            {name: 'username', value: 'JohnSmith'}
          }
        )
        // fill in password field with cats  
        wrapper.find('[name="password"]').simulate(
          'change', 
          {target: 
             {name: 'password', value: 'cats'}
          }
        )
        // fill in password field with cats  
        wrapper.find('[name="password2"]').simulate(
          'change', 
          {target: 
             {name: 'password2', value: 'cats'}
          }
        )
        // simulate form submission   
        // Ok to use `form` as a selector as there is only one form within the component
        wrapper.find('form').simulate(
          'submit', 
          {preventDefault() {}}
        )
        
        // test to see arguments used after its been submitted 
        expect(mockRegisterUserfn.mock.calls[1][0]).toEqual(
            {
                email: 'blah@gmail.com',
                username: 'JohnSmith',
                password: 'cats',
                password2: 'cats'
            }
        )
    });
});