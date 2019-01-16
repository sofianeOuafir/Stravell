import React from 'react';
import { shallow } from 'enzyme';
import { Checkbox } from './../../components/Checkbox';

const onChange = jest.fn();
let props = { onChange, checked: true, label: 'My checkbox', id: 'abc123' };


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

test('should trigger onChange method when checkbox get checked', () => {
  const wrapper = shallow(<Checkbox { ...props } />);
  wrapper.find('input').simulate('change');
  expect(onChange).toHaveBeenCalled();
});