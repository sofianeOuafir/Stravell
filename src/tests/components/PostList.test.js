import React from "react";
import { shallow } from "enzyme";
import PostList from "./../../components/PostList";
import posts from './../fixtures/posts';

describe('data props array contains some posts', () => {
  test('should render correctly', () => {
    const wrapper = shallow(<PostList data={posts} />);
    expect(wrapper).toMatchSnapshot();
  });
});

describe('data props array do NOT contain any post', () => {
  test('should render correctly', () => {
    const wrapper = shallow(<PostList data={[]} noDataText="There is no post at the moment in this list" />);
    expect(wrapper).toMatchSnapshot();
  });
});