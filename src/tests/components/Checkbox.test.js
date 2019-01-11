import React from 'react';
import { shallow } from 'enzyme';
import { Checkbox } from './../../components/Checkbox';

const handleChange = jest.fn();
let props = { handleChange, checked: true, label: 'My checkbox' };


describe('checked props is false', () => {
  props.checked = false;
  const wrapper = shallow(<Checkbox { ...props } />);
  test('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

describe('checked props is true', () => {
  props.checked = true;
  const wrapper = shallow(<Checkbox { ...props } />);
  test('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

test('should trigger handleChange method when checkbox get checked', () => {
  const wrapper = shallow(<Checkbox { ...props } />);
  wrapper.find('input').simulate('change');
  expect(handleChange).toHaveBeenCalled();
});