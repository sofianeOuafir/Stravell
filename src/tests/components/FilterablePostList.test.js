import React from "react";
import { shallow } from "enzyme";
import { FilterablePostList } from "./../../components/FilterablePostList";
import posts from "./../fixtures/posts";

describe("the component get passed a non empty array of posts", () => {
  test("should render correctly", () => {
    const wrapper = shallow(
      <FilterablePostList posts={posts} filteredPosts={posts} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  describe("the filtered posts array is empty", () => {
    const filteredPosts = [];
    const text = '10 things to do';
    const countryCode = 'BR';
    test("should render correctly when the text filter and country filters are present", () => {
      const wrapper = shallow(
        <FilterablePostList posts={posts} filteredPosts={filteredPosts} filters={{ text, countryCode }} />
      );
      expect(wrapper).toMatchSnapshot();
    });
    test("should render correctly when only the text filter", () => {
      const wrapper = shallow(
        <FilterablePostList posts={posts} filteredPosts={filteredPosts} filters={{ text }} />
      );
      expect(wrapper).toMatchSnapshot();
    });
    test("should render correctly when only the country filter", () => {
      const wrapper = shallow(
        <FilterablePostList posts={posts} filteredPosts={filteredPosts} filters={{ countryCode }} />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});

describe("the component get passed an empty array of posts", () => {
  test("should render correctly and not display the filters component", () => {
    const posts = [];
    const wrapper = shallow(
      <FilterablePostList
        posts={posts}
        noPostText="They are currently no posts written yet"
        filteredPosts={posts}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});

test("should render correctly when withCountryFilter props is true", () => {
  const wrapper = shallow(
    <FilterablePostList
      posts={posts}
      filteredPosts={posts}
      withCountryFilter={true}
    />
  );
  expect(wrapper).toMatchSnapshot();
});

test("should render correctly when withCountryFilter props is false", () => {
  const wrapper = shallow(
    <FilterablePostList
      posts={posts}
      filteredPosts={posts}
      withCountryFilter={false}
    />
  );
  expect(wrapper).toMatchSnapshot();
});
