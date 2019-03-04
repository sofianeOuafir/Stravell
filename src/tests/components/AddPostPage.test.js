import React from "react";
import { shallow } from "enzyme";
import { AddPostPage } from "../../components/AddPostPage";
import PostForm from "./../../components/PostForm";

const addPost = jest.fn(() => {
  return Promise.resolve();
});
const router = { push: jest.fn() };
const uid = 1;
const userName = "Sofiane";
const props = { addPost, router, uid, userName };
let wrapper;

beforeEach(() => {
  wrapper = shallow(<AddPostPage {...props} />);
});

test("should render correctly", () => {
  expect(wrapper).toMatchSnapshot();
});

test("should add the post and redirect the user to the dashboard when the form get submitted", done => {
  console.log(wrapper.debug());
  wrapper.find(PostForm).simulate("submit", {});
  new Promise((resolve, reject) => {
    expect(addPost).toHaveBeenCalled();
    resolve();
  }).then(() => {
    expect(router.push).toHaveBeenCalledWith(
      "/dashboard?uid=1",
      "/dashboard/sofiane/1"
    );
    done();
  });
});
