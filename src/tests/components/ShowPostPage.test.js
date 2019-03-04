import React from "react";
import { shallow } from "enzyme";
import { ShowPostPage } from "./../../components/ShowPostPage";
import posts from './../fixtures/posts';

test('should render correctly if post do not have an address', () => {
  let post = Object.assign({}, posts[0]);
  post.address = null;
  const wrapper = shallow(<ShowPostPage post={post}/>)
  expect(wrapper).toMatchSnapshot();
});

test('should render correctly if post have an address', () => {
  let post = posts[0];
  const wrapper = shallow(<ShowPostPage post={post}/>)
  expect(wrapper).toMatchSnapshot();
});

test('should render correctly if post have been provided a link', () => {
  let post = posts[0];
  post.provideURL = true;
  post.providedURL = 'http://google.com';
  const wrapper = shallow(<ShowPostPage post={post}/>)
  expect(wrapper).toMatchSnapshot();
});