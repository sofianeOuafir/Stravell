import React from "react";
import { shallow } from "enzyme";
import { UserWallPage } from "./../../components/UserWallPage";
import posts from './../fixtures/posts';
import users from './../fixtures/users';

test('should render correctly', () => {
  let user = users[0];
  user.id = user.uid;
  const wrapper = shallow(<UserWallPage posts={posts} user={user} />);
  expect(wrapper.update()).toMatchSnapshot();
});