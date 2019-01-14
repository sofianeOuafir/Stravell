import React from 'react';
import { shallow } from 'enzyme';
import { FilterablePostList } from './../../components/FilterablePostList';
import posts from './../fixtures/posts';

describe('the component get passed a non empty array of posts', () => {
  test('should render correctly', () => {
    const wrapper = shallow(<FilterablePostList posts={posts} filteredPosts={posts} />);
    expect(wrapper).toMatchSnapshot();
  });
});

describe('the component get passed an empty array of posts', () => {
  test('should render correctly and not display the filters component', () => {
    const posts = [];
    const wrapper = shallow(<FilterablePostList posts={posts} filteredPosts={posts} />);
    expect(wrapper).toMatchSnapshot();
  });
});
