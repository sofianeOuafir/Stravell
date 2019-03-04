import React from "react";
import { shallow } from "enzyme";
import { EditPostPage } from "./../../components/EditPostPage";
import PostForm from "./../../components/PostForm";
import posts from "./../fixtures/posts";

const removePost = jest.fn(() => {
  return Promise.resolve();
});
const addPost = jest.fn(() => {
  return Promise.resolve();
});
const router = { push: jest.fn() };
const post = posts[0];
const uid = 1;
const userName = "Sofiane";
const props = { removePost, addPost, router, post, uid, userName };
let wrapper;

beforeEach(() => {
  wrapper = shallow(<EditPostPage {...props} />);
});

test("should render correctly", () => {
  expect(wrapper).toMatchSnapshot();
});

test("should edit the post and redirect the user to the dashboard when the form get submitted", done => {
  wrapper.find(PostForm).simulate("submit", {});
  new Promise((resolve, reject) => {
    expect(removePost).toHaveBeenCalled();
    resolve();
  }).then(() => {
    expect(addPost).toHaveBeenCalled();
  })
});
