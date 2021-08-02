import React from 'react';
import { shallow, render, mount } from 'enzyme';
import { CreatePlaylist } from './CreatePlaylist';

describe('CreatePlaylist component', () => {
    let wrapper;
    const mockCreatePlaylistfn = jest.fn();
    const auth = {
        isAuthenticated: true,
    }
    beforeEach(() => {
        wrapper = shallow(
        <CreatePlaylist
            createPlaylist={mockCreatePlaylistfn}
            auth={auth}
            errors={{}}
        />)
    });

    it('should fully render(Full DOM) correctly', () => {
        const auth = {
            isAuthenticated: true,
        }
        const mockCreatePlaylistfn = jest.fn();
        const component = mount(
            <CreatePlaylist
                createPlaylist={mockCreatePlaylistfn}
                auth={auth}
                errors={{}}
            />
        );
        expect(component).toMatchSnapshot();
    });

    describe("CreatePlaylist inputs - ", () => {
        test("name input shows the expected text when user enters text", () => {
            const wrapper = mount(
                <CreatePlaylist
                createPlaylist={mockCreatePlaylistfn}
                auth={auth}
                errors={{}}
            />
            );
            wrapper.find('#name').at(1).simulate('change', 
                {target: 
                    {name: 'name', value: 'Daniels new playlist'}
                }
            );
            const nameInput = wrapper.find('#name').at(1).html();
            
            expect(nameInput).toEqual(expect.stringContaining('Daniels new playlist'));
        });
        
        test("Playlist URL input shows the expected text when user enters text", () => {
            const wrapper = mount(
                <CreatePlaylist
                createPlaylist={mockCreatePlaylistfn}
                auth={auth}
                errors={{}}
            />
            );
            wrapper.find('#name').at(1).simulate('change', 
                {target: 
                    {name: 'slug', value: 'sluggg'}
                }
            );
            const nameInput = wrapper.find('#slug').at(1).html();
            
            expect(nameInput).toEqual(expect.stringContaining('sluggg'));
        });
    });

})