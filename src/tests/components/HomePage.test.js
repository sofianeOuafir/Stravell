import React from "react";
import { shallow } from "enzyme";
import { HomePage } from "./../../components/HomePage";

describe('A userName prop is provided', () => {
  test('should render correctly', () => {
    const props = { userName: 'Sofiane', posts: [] };
    const wrapper = shallow(<HomePage { ...props } />);
    expect(wrapper).toMatchSnapshot();
  });
});

describe('no username prop is provided', () => {
  test('should render correctly', () => {
    const props = { posts: [] };
    const wrapper = shallow(<HomePage { ...props } />);
    expect(wrapper).toMatchSnapshot();
  });
});