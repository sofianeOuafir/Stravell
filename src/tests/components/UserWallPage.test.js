import React from "react";
import { shallow } from "enzyme";
import { UserWallPage } from "./../../components/UserWallPage";
import posts from './../fixtures/posts';

test('should render correctly', () => {
  const user = { userName: 'Sofiane' };
  const wrapper = shallow(<UserWallPage posts={posts} user={user} />);
  expect(wrapper.update()).toMatchSnapshot();
});