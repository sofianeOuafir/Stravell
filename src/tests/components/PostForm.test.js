import React from "react";
import { shallow } from "enzyme";
import PostForm from "./../../components/PostForm";
import {
  MIN_NUM_OF_CHARACTERS_FOR_DESCRIPTION,
  MAX_NUM_OF_CHARACTERS_FOR_DESCRIPTION,
  DESCRIPTION_TOO_SHORT_ERROR,
  DESCRIPTION_TOO_LONG_ERROR,
  TITLE_TOO_SHORT_ERROR,
  TITLE_TOO_LONG_ERROR,
  MIN_NUM_OF_CHARACTERS_FOR_TITLE,
  MAX_NUM_OF_CHARACTERS_FOR_TITLE
} from "./../../constants/constants";

import { uploadFile } from "./../../aws/s3.js";
jest.mock("./../../aws/s3.js", () => ({
  uploadFile: jest.fn()
}));

const generateTooShortString = length => {
  let word = "";
  for (var i = 0; i < length - 1; i++) {
    word += "a";
  }
  return word;
};

const generateTooLongString = length => {
  let word = "";
  for (var i = 0; i < length + 1; i++) {
    word += "a";
  }
  return word;
};

let wrapper;
beforeEach(() => {
  wrapper = shallow(<PostForm />);
});

describe("post - description", () => {
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
    const description = generateTooShortString(
      MIN_NUM_OF_CHARACTERS_FOR_DESCRIPTION
    );
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

  describe("the description is too long", () => {
    const description = generateTooLongString(
      MAX_NUM_OF_CHARACTERS_FOR_DESCRIPTION
    );
    const eventObject = { target: { value: description } };

    test("should change the state correctly", () => {
      expect(wrapper.state("description")).toEqual("");
      expect(wrapper.state("descriptionError")).toEqual("");
      wrapper.find("#descriptionInput").simulate("change", eventObject);
      expect(wrapper.state("description")).toEqual(description);
      expect(wrapper.state("descriptionError")).toEqual(
        DESCRIPTION_TOO_LONG_ERROR
      );
    });

    test("should render correctly", () => {
      wrapper.find("#descriptionInput").simulate("change", eventObject);
      expect(wrapper).toMatchSnapshot();
    });
  });
});

describe("post - title", () => {
  describe("the title is changing", () => {
    const title = "A new title";
    const eventObject = { target: { value: title } };

    test("should change the state correctly", () => {
      expect(wrapper.state("title")).toEqual("");
      wrapper.find("#titleInput").simulate("change", eventObject);
      expect(wrapper.state("title")).toEqual(title);
    });

    test("should render correctly", () => {
      wrapper.find("#titleInput").simulate("change", eventObject);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("the title is too short", () => {
    const title = generateTooShortString(MIN_NUM_OF_CHARACTERS_FOR_TITLE);
    const eventObject = { target: { value: title } };

    test("should change the state correctly", () => {
      expect(wrapper.state("title")).toEqual("");
      expect(wrapper.state("titleError")).toEqual("");
      wrapper.find("#titleInput").simulate("change", eventObject);
      expect(wrapper.state("title")).toEqual(title);
      expect(wrapper.state("titleError")).toEqual(TITLE_TOO_SHORT_ERROR);
    });

    test("should render correctly", () => {
      wrapper.find("#titleInput").simulate("change", eventObject);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("the title is too long", () => {
    const title = generateTooLongString(MAX_NUM_OF_CHARACTERS_FOR_TITLE);
    const eventObject = { target: { value: title } };

    test("should change the state correctly", () => {
      expect(wrapper.state("title")).toEqual("");
      expect(wrapper.state("titleError")).toEqual("");
      wrapper.find("#titleInput").simulate("change", eventObject);
      expect(wrapper.state("title")).toEqual(title);
      expect(wrapper.state("titleError")).toEqual(TITLE_TOO_LONG_ERROR);
    });

    test("should render correctly", () => {
      wrapper.find("#titleInput").simulate("change", eventObject);
      expect(wrapper).toMatchSnapshot();
    });
  });
});

describe("post - image", () => {
  const file = { type: ".png" };
  const eventObject = { target: { files: [file] } };

  describe("the image get changed", () => {
    beforeEach(() => {
      uploadFile.mockImplementation(() => {
        const Location = 'https://somewhere.com';
        return Promise.resolve({ Location });
      });
    });

    test("should change the state correctly", done => {
      wrapper.find("#imageInput").simulate("change", eventObject);
      return Promise.resolve().then(() => {
        expect(wrapper.state("image")).toEqual("https://somewhere.com");
        done();
      });
    });

    test("should render correctly", done => {
      wrapper.find("#imageInput").simulate("change", eventObject);
      return Promise.resolve().then(() => {
        wrapper.update();
        expect(wrapper).toMatchSnapshot();
        done();
      });
    });
  });

  describe('An error occured when the image get uploaded', () => {
    beforeEach(() => {
      uploadFile.mockImplementation(() => {
        return Promise.reject('an error occurred');
      });
    });

    test("should change the state correctly", (done) => {
      wrapper.find("#imageInput").simulate("change", eventObject);
      return Promise.resolve().then(() => {
        wrapper.update();
        expect(wrapper.state("imageError")).toEqual('an error occurred');
        done();
      })
    });

    test('should render correctly', (done) => {
      wrapper.find("#imageInput").simulate("change", eventObject);
      return Promise.resolve().then(() => {
        expect(wrapper).toMatchSnapshot();
        done();
      });
    });
  });
});
