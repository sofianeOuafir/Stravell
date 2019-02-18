import React from "react";
import { shallow } from "enzyme";
import { ShowPostPage } from "./../../components/ShowPostPage";
import posts from './../fixtures/posts';

let post;

beforeEach(() => {
  post = posts[0];
});

test('should render correctly if post do not have an address', () => {
  post.address = null;
  const wrapper = shallow(<ShowPostPage post={post}/>)
  expect(wrapper).toMatchSnapshot();
});

test('should render correctly if post have an address', () => {
  const wrapper = shallow(<ShowPostPage post={post}/>)
  expect(wrapper).toMatchSnapshot();
});

test('should render correctly if post have been provided a link', () => {
  post.provideURL = true;
  post.providedURL = 'http://google.com';
  const wrapper = shallow(<ShowPostPage post={post}/>)
  expect(wrapper).toMatchSnapshot();
});