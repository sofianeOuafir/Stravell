import React from "react";
import { shallow } from "enzyme";
import PostForm from "./../../components/PostForm";
import {
  MIN_NUM_OF_CHARACTERS_FOR_TITLE,
  DESCRIPTION_TOO_SHORT_ERROR
} from "./../../constants/constants";

const generateTooShortString = length => {
  let word = "";
  for (var i = 0; i < length - 1; i++) {
    word += "a";
  }
  return word;
};

describe("post - description", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<PostForm />);
  });

  describe("the description is changing", () => {
    const description = "A new description";
    const eventObject = { target: { value: description } };

    test("should change the state correctly", () => {
      expect(wrapper.state("description")).toEqual("");
      wrapper.find("#descriptionInput").simulate("change", eventObject);
      expect(wrapper.state("description")).toEqual(description);
    });

    test("should render correctly", () => {
      wrapper.find("#descriptionInput").simulate("change", eventObject);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("the description is too short", () => {
    const description = generateTooShortString(MIN_NUM_OF_CHARACTERS_FOR_TITLE);
    const eventObject = { target: { value: description } };

    test("should change the state correctly", () => {
      expect(wrapper.state("description")).toEqual("");
      expect(wrapper.state("descriptionError")).toEqual("");
      wrapper.find("#descriptionInput").simulate("change", eventObject);
      expect(wrapper.state("description")).toEqual(description);
      expect(wrapper.state("descriptionError")).toEqual(
        DESCRIPTION_TOO_SHORT_ERROR
      );
    });

    test("should render correctly", () => {
      wrapper.find("#descriptionInput").simulate("change", eventObject);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
