import React from "react";
import { shallow } from "enzyme";
import { ShowPostPage } from "./../../components/ShowPostPage";
import posts from './../fixtures/posts';

test('should render correctly if post do not have an address', () => {
  posts[0].address = null;
  const wrapper = shallow(<ShowPostPage post={posts[0]}/>)
  expect(wrapper).toMatchSnapshot();
});

test('should render correctly if post have an address', () => {
  const wrapper = shallow(<ShowPostPage post={posts[0]}/>)
  expect(wrapper).toMatchSnapshot();
});