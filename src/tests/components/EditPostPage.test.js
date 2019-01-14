import React from 'react';
import { shallow } from 'enzyme';
import { EditPostPage } from './../../components/EditPostPage';
import { PostForm } from './../../components/PostForm';

const startEditPost = jest.fn();
const history = { push: jest.fn() };
const post = { id: 1 };
const props = { startEditPost, history, post };
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
  expect(history.push).toHaveBeenCalledWith('/dashboard');
});