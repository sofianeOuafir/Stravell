import React from "react";
import { shallow } from "enzyme";
import { convertFromRaw, EditorState } from "draft-js";

import { PostForm } from "./../../components/PostForm";
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
import posts from "./../fixtures/posts";
import { uploadFile } from "./../../aws/s3.js";
import { getLocationData } from "./../../places/places";
import { getTitleError } from './../../lib/utils/post.js';
import { generateTooLongString, generateTooShortString } from './../helpers/helpers';
jest.mock("./../../aws/s3.js", () => ({
  uploadFile: jest.fn()
}));

jest.mock("./../../places/places.js");

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
  describe("the image got changed and uploaded successfully", () => {
    let file = { type: "image/png" };
    const eventObject = { target: { files: [file] } };

    beforeEach(() => {
      uploadFile.mockImplementation(() => {
        const Location = "https://somewhere.com";
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

  describe("the format of the file is not an accepted format", () => {
    let file = { type: "something weird" };
    const eventObject = { target: { files: [file] } };
    test("should change the state correctly", () => {
      wrapper.find("#imageInput").simulate("change", eventObject);
      expect(wrapper.state("imageError")).toEqual(
        "The format of the uploaded image is not accepted."
      );
    });

    test("should render correctly", () => {
      wrapper.find("#imageInput").simulate("change", eventObject);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("An error occured when the image got uploaded", () => {
    let file = { type: "image/png" };
    const eventObject = { target: { files: [file] } };

    beforeEach(() => {
      uploadFile.mockImplementation(() => {
        return Promise.reject("an error occurred");
      });
    });

    test("should change the state correctly", done => {
      wrapper.find("#imageInput").simulate("change", eventObject);
      return Promise.resolve().then(() => {
        return Promise.resolve().then(() => {
          expect(wrapper.update().state("imageError")).toEqual(
            "an error occurred"
          );
          done();
        });
      });
    });

    test("should render correctly", done => {
      wrapper.find("#imageInput").simulate("change", eventObject);
      return Promise.resolve().then(() => {
        return Promise.resolve().then(() => {
          wrapper.update();
          expect(wrapper).toMatchSnapshot();
          done();
        });
      });
    });
  });
});

describe("post - body", () => {
  describe("the body is changing", () => {
    const body = EditorState.createWithContent(
      convertFromRaw(JSON.parse(posts[0].body))
    );

    test("should change the state correctly", () => {
      expect(wrapper.state("body")).toEqual({});
      wrapper.find("#editor").simulate("change", body);
      expect(wrapper.state("body")).toEqual(body);
    });

    test("should render correctly", () => {
      wrapper.find("#editor").simulate("change", body);
      expect(wrapper).toMatchSnapshot();
    });
  });
});

describe('post - provided URL', () => { 
  beforeEach(() => {
    wrapper.setState({ provideURL: true });
  });

  describe('the provided URL has changed and is valid', () => {
    const providedURL = 'https://www.google.com';
    const eventObject = { target: { value: providedURL } };
    test('should set the state correctly', () => {
      wrapper.find(`#providedURLInput`).simulate('change', eventObject);
      expect(wrapper.state('providedURL')).toEqual(providedURL);
    });

    test('should render correctly', () => {
      wrapper.find(`#providedURLInput`).simulate('change', eventObject);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('the provided URL has changed and is NOT valid', () => {
    const providedURL = 'google.com';
    const eventObject = { target: { value: providedURL } };
    test('should set the state correctly', () => {
      wrapper.find(`#providedURLInput`).simulate('change', eventObject);
      expect(wrapper.state('providedURL')).toEqual(providedURL);
    });

    test('should render correctly', () => {
      wrapper.find(`#providedURLInput`).simulate('change', eventObject);
      expect(wrapper).toMatchSnapshot();
    });
  });
});

describe('post - provideURL', () => {
  describe('provideURL has changed to be true', () => {
    beforeEach(() => {
      wrapper.setState({ provideURL: false });
    })

    test('should set the state correctly', () => {
      expect(wrapper.state('provideURL')).toEqual(false);
      wrapper.find(`#provideURLTrue`).simulate('change');
      expect(wrapper.state('provideURL')).toEqual(true);
    });

    test('should render correctly', () => {
      expect(wrapper.state('provideURL')).toEqual(false);
      wrapper.find(`#provideURLTrue`).simulate('change');
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('provideURL has changed to be false', () => {
    beforeEach(() => {
      wrapper.setState({ provideURL: true });
    });

    test('should set the state correctly', () => {
      expect(wrapper.state('provideURL')).toEqual(true);
      wrapper.find(`#provideURLFalse`).simulate('change');
      expect(wrapper.state('provideURL')).toEqual(false);
    });

    test('should render correctly', () => {
      expect(wrapper.state('provideURL')).toEqual(true);
      wrapper.find(`#provideURLFalse`).simulate('change');
      expect(wrapper).toMatchSnapshot();
    });
  });
});

describe('form submission', () => {
  describe('the form get submitted without error', () => {
    test('should call submit prop', (done) => {
      const onSubmit = jest.fn();
      const post = posts[0];
      const { body, ...rest } = post;
      const parsedBody = EditorState.createWithContent(
        convertFromRaw(JSON.parse(post.body))
      );
      wrapper.setProps({ onSubmit });
      wrapper.setState({ body: parsedBody, ...rest });
      wrapper.find('#form').simulate('submit', { preventDefault: () => {}});
      Promise.resolve().then(() => {
        expect(onSubmit).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('the form get submitted with some errors (title is too short)', () => {
    test('should not call submit prop', () => {
      const onSubmit = jest.fn();
      const post = posts[0];
      const { body, title, ...rest } = post;
      const parsedBody = EditorState.createWithContent(
        convertFromRaw(JSON.parse(post.body))
      );
      wrapper.setProps({ onSubmit });
      wrapper.setState({ body: parsedBody, title: generateTooShortString(MIN_NUM_OF_CHARACTERS_FOR_TITLE), ...rest });
      wrapper.find('#form').simulate('submit', { preventDefault: () => {}});
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });
});