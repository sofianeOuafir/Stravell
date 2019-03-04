import React from "react";
import { shallow } from "enzyme";
import { FilterableDataList } from "./../../components/FilterableDataList";
import posts from "./../fixtures/posts";
import PostList from "../../components/PostList";

describe("the component get passed a non empty array of data", () => {
  test("should render correctly", () => {
    const wrapper = shallow(
      <FilterableDataList
        DataList={PostList}
        data={posts}
        filteredData={posts}
        mapConfig={{
          visible: true
        }}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  describe("the filtered data array is empty", () => {
    const props = {
      DataList: PostList,
      data: posts,
      filteredData: [],
      filters: {
        text: "10 things to do"
      },
      mapConfig: {
        visible: true
      }
    };
    test("should render correctly", () => {
      const wrapper = shallow(<FilterableDataList {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});

describe("the component get passed an empty array of data", () => {
  const props = {
    DataList: PostList,
    data: [],
    filteredData: [],
    mapConfig: {
      visible: true
    },
    noDataText: "They are currently no post written yet."
  };
  test("should render correctly and not display the search bar", () => {
    const wrapper = shallow(<FilterableDataList {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});

test("should render correctly when it get passed breadCrumbProps", () => {
  const props = {
    DataList: PostList,
    data: [],
    filteredData: [],
    mapConfig: {
      visible: true
    },
    noDataText: "They are currently no post written yet.",
    breadCrumbProps: {
      links: [
        {
          href: "www.google.com",
          as: "google.com"
        },
        {
          href: "www.youtube.com",
          as: "youtube.com",
          active: true
        }
      ]
    }
  };

  const wrapper = shallow(<FilterableDataList {...props} />);
  expect(wrapper).toMatchSnapshot();
});

test("should render correctly when withMap is false", () => {
  const props = {
    DataList: PostList,
    data: [],
    filteredData: [],
    withMap: false,
    mapConfig: {
      visible: true
    },
    noDataText: "They are currently no post written yet."
  };
  const wrapper = shallow(<FilterableDataList {...props} />);
  expect(wrapper).toMatchSnapshot();
});

test("should render correctly when withMap is true", () => {
  const props = {
    DataList: PostList,
    data: [],
    filteredData: [],
    withMap: true,
    mapConfig: {
      visible: true
    },
    noDataText: "They are currently no post written yet."
  };
  const wrapper = shallow(<FilterableDataList {...props} />);
  expect(wrapper).toMatchSnapshot();
});

test("should render correctly when withMap is true and mapConfig.visible is false", () => {
  const props = {
    DataList: PostList,
    data: [],
    filteredData: [],
    withMap: true,
    mapConfig: {
      visible: false
    },
    noDataText: "They are currently no post written yet."
  };
  const wrapper = shallow(<FilterableDataList {...props} />);
  expect(wrapper).toMatchSnapshot();
});

test("should set the map visibily when the toggle component change", () => {
  const props = {
    DataList: PostList,
    data: [],
    filteredData: [],
    withMap: true,
    mapConfig: {
      visible: false
    },
    noDataText: "They are currently no post written yet.",
    setMapVisibility: jest.fn()
  };

  const wrapper = shallow(<FilterableDataList {...props} />);
  wrapper.find("#showMap").simulate("change");
  expect(props.setMapVisibility).toHaveBeenCalled();
});
