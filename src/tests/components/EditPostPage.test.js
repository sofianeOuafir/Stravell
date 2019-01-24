import React from 'react';
import { shallow } from 'enzyme';
import { EditPostPage } from './../../components/EditPostPage';
import { PostForm } from './../../components/PostForm';

const startEditPost = jest.fn();
const router = { push: jest.fn() };
const post = { id: 1 };
const uid = 1;
const userName = 'Sofiane'
const props = { startEditPost, router, post, uid, userName };
let wrapper;

beforeEach(() => {
  wrapper = shallow(<EditPostPage { ...props } />);
});

test('should render correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('should edit the post and redirect the user to the dashboard when the form get submitted', () => {
  wrapper.find(PostForm).simulate('submit', { });
  expect(startEditPost).toHaveBeenCalled();
  expect(router.push).toHaveBeenCalledWith('/dashboard?uid=1', "/dashboard/sofiane/1");
});