import React from "react";
import { shallow } from "enzyme";
import { PostListItem } from "./../../components/PostListItem";
import posts from './../fixtures/posts';

let post;

beforeEach(() => {
  post = posts[0];
});

describe('the post contains a body and no URL has been provided', () => {
  test('should render correctly', () => {
    expect(post).toMatchObject({ provideURL: false, providedURL: "" });
    const wrapper = shallow(<PostListItem post={post} />);
    expect(wrapper).toMatchSnapshot();
  });
});

describe('the post DO NOT contains a body and and a URL has been provided', () => {
  test('should render correctly', () => {
    const providedURL = "https://www.google.com";
    const provideURL = true;
    post.providedURL = providedURL;
    post.provideURL = provideURL;
    expect(post).toMatchObject({ provideURL, providedURL });
    const wrapper = shallow(<PostListItem post={post} />);
    expect(wrapper).toMatchSnapshot();
  });
});

describe('the post belongs to the current user and props.editable is true', () => {
  test('should be possible to edit the post', () => {
    const wrapper = shallow(<PostListItem post={post} editable={true} isOwnedByCurrentUser={true} />);
    expect(wrapper).toMatchSnapshot();
  });
});

describe('the post belongs DO NOT belongs to the current user and props.editable is true', () => {
  test('should NOT be possible to edit the post', () => {
    const wrapper = shallow(<PostListItem post={post} editable={true} isOwnedByCurrentUser={false} />);
    expect(wrapper).toMatchSnapshot();
  });
});

describe('the post belongs to the current user and props.editable is false', () => {
  test('should NOT be possible to edit the post', () => {
    const wrapper = shallow(<PostListItem post={post} editable={false} isOwnedByCurrentUser={true} />);
    expect(wrapper).toMatchSnapshot();
  });
});

test('should display correctly when post has an address', () => {
  const wrapper = shallow(<PostListItem post={post} />);
  expect(wrapper).toMatchSnapshot();
});

test('should display correctly when post does not have address', () => {
  post.address = "";
  const wrapper = shallow(<PostListItem post={post} />);
  expect(wrapper).toMatchSnapshot();
});

