import React from "react";
import { shallow } from "enzyme";
import { UserWallPage } from "./../../components/UserWallPage";
import posts from './../fixtures/posts';

test('should render correctly', () => {
  const startGetUser = jest.fn();
  const userName = 'Sofiane';
  const wrapper = shallow(<UserWallPage startGetUser={startGetUser} posts={posts} />);
  wrapper.setState({ title: userName, user: { userName } });
  expect(wrapper.update()).toMatchSnapshot();
});

test('should call startGetUser on componentDidMount', () => {
  const startGetUser = jest.fn(() => {
    return Promise.resolve({ key: 'abc123', val: () => ({ userName: 'Sofiane' }) });
  });
  const wrapper = shallow(<UserWallPage startGetUser={startGetUser} posts={posts} />);
  wrapper.instance().componentDidMount();
  expect(startGetUser).toHaveBeenCalled();
});