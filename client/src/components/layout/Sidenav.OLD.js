import Sidenav from './Sidenav';

describe('Sidenav shallow', () => {
  it('should render correctly in "debug" mode', () => {
    const component = shallow(<Sidenav debug />);
  
    expect(component).toMatchSnapshot();
  });
});