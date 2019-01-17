import React from "react";
import { shallow } from "enzyme";
import { ShowPostPage } from "./../../components/ShowPostPage";
import posts from './../fixtures/posts';

test('should render correctly', () => {
  const wrapper = shallow(<ShowPostPage post={posts[0]}/>)
  expect(wrapper).toMatchSnapshot();
});