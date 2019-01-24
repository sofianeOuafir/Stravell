import React from "react";
import { shallow } from "enzyme";
import { UserWallPage } from "./../../components/UserWallPage";
import posts from './../fixtures/posts';

test('should render correctly', () => {
  const userName = 'Sofiane';
  const wrapper = shallow(<UserWallPage posts={posts} userName={userName} />);
  expect(wrapper.update()).toMatchSnapshot();
});