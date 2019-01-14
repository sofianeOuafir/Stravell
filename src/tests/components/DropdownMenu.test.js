import React from 'react';
import { shallow } from 'enzyme';
import DropdownMenu from './../../components/DropdownMenu';

const props = { title: 'Foo', titleClassName: 'foobar', };
let wrapper;
beforeEach(() => {
  wrapper = shallow(<DropdownMenu {...props}><button>Bar</button></DropdownMenu>);
})

test('should render correctly with default values', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should set the component state to be showMenu = true when the main button get clicked', () => {
  expect(wrapper.state('showMenu')).toEqual(false);
  wrapper.find(`.${props.titleClassName}`).simulate('click', { preventDefault: () => {} });
  expect(wrapper.state('showMenu')).toEqual(true);
  expect(wrapper).toMatchSnapshot();
});


