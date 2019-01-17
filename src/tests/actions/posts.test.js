import { addPost, editPost, setPosts } from "./../../actions/posts";
import posts from "./../fixtures/posts";

describe("addPost", () => {
  test("should return the right value", () => {
    const post = posts[0];
    expect(addPost(post)).toEqual({ type: "ADD_POST", post });
  });
});

describe("setPosts", () => {
  test("should return the right value", () => {
    expect(setPosts(posts)).toEqual({ type: "SET_POSTS", posts });
  });
});

describe("editPost", () => {
  test("should return the right value", () => {
    const title = 'a new title';
    const updates = { title };
    const id = 1;
    expect(editPost({ id, updates })).toEqual({
      type: "EDIT_POST",
      id,
      updates
    });
  });
});
