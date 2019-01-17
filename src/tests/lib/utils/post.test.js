import {
  formatTitle,
  formatDescription,
  formatBody,
  getBodyError,
  getTitleError,
  getDescriptionError,
  getImageError,
  getProvidedURLError
} from "./../../../lib/utils/post";

import {
  NO_BODY_PROVIDED_ERROR,
  MIN_NUM_OF_CHARACTERS_FOR_BODY,
  BODY_TOO_SHORT_ERROR,
  NO_TITLE_PROVIDED_ERROR,
  MIN_NUM_OF_CHARACTERS_FOR_TITLE,
  TITLE_TOO_SHORT_ERROR,
  MAX_NUM_OF_CHARACTERS_FOR_TITLE,
  TITLE_TOO_LONG_ERROR,
  NO_DESCRIPTION_PROVIDED_ERROR,
  MIN_NUM_OF_CHARACTERS_FOR_DESCRIPTION,
  DESCRIPTION_TOO_SHORT_ERROR,
  MAX_NUM_OF_CHARACTERS_FOR_DESCRIPTION,
  DESCRIPTION_TOO_LONG_ERROR,
  NO_IMAGE_URL_PROVIDED_ERROR,
  PROVIDED_URL_ERROR
} from "./../../../constants/constants";
import { generateTooShortString, generateValidStringLength, generateTooLongString } from "./../../helpers/helpers";

describe("formatTitle", () => {
  test("should capitalize first letter of each word and remove useless spaces", () => {
    const title = " my amazing title!   ";
    expect(formatTitle(title)).toEqual("My Amazing Title!");
  });
});

describe("formatDescription", () => {
  test("should capitalize first letter of the sentence and remove useless spaces", () => {
    const description = " my amazing description!   ";
    expect(formatDescription(description)).toEqual("My amazing description!");
  });
});

describe("formatBody", () => {
  test("should remove useless spaces", () => {
    const body = " my amazing body!   ";
    expect(formatBody(body)).toEqual("my amazing body!");
  });
});

describe("getBodyError", () => {
  describe("body provided is empty", () => {
    test("should return the right value", () => {
      expect(getBodyError("")).toEqual(NO_BODY_PROVIDED_ERROR);
    });
  });

  describe("body provided is too short", () => {
    test("should return the right value", () => {
      const body = generateTooShortString(MIN_NUM_OF_CHARACTERS_FOR_BODY);
      expect(getBodyError(body)).toEqual(BODY_TOO_SHORT_ERROR);
    });
  });

  describe("body provided is valid", () => {
    test("should return the right value", () => {
      const body = generateValidStringLength({ min_length: MIN_NUM_OF_CHARACTERS_FOR_BODY });
      expect(getBodyError(body)).toEqual("");
    });
  });
});

describe("getTitleError", () => {
  describe("title provided is empty", () => {
    test("should return the right value", () => {
      expect(getTitleError("")).toEqual(NO_TITLE_PROVIDED_ERROR);
    });
  });

  describe("title provided is too short", () => {
    test("should return the right value", () => {
      const title = generateTooShortString(MIN_NUM_OF_CHARACTERS_FOR_TITLE);
      expect(getTitleError(title)).toEqual(TITLE_TOO_SHORT_ERROR);
    });
  });

  describe("title provided is too long", () => {
    test("should return the right value", () => {
      const title = generateTooLongString(MAX_NUM_OF_CHARACTERS_FOR_TITLE);
      expect(getTitleError(title)).toEqual(TITLE_TOO_LONG_ERROR);
    });
  });

  describe("title provided is valid", () => {
    test("should return the right value", () => {
      const title = generateValidStringLength({ min_length: MIN_NUM_OF_CHARACTERS_FOR_TITLE, max_length: MAX_NUM_OF_CHARACTERS_FOR_TITLE });
      expect(getTitleError(title)).toEqual("");
    });
  });
});

describe("getDescriptionError", () => {
  describe("description provided is empty", () => {
    test("should return the right value", () => {
      expect(getDescriptionError("")).toEqual(NO_DESCRIPTION_PROVIDED_ERROR);
    });
  });

  describe("description provided is too short", () => {
    test("should return the right value", () => {
      const description = generateTooShortString(MIN_NUM_OF_CHARACTERS_FOR_DESCRIPTION);
      expect(getDescriptionError(description)).toEqual(DESCRIPTION_TOO_SHORT_ERROR);
    });
  });

  describe("description provided is too long", () => {
    test("should return the right value", () => {
      const description = generateTooLongString(MAX_NUM_OF_CHARACTERS_FOR_DESCRIPTION);
      expect(getDescriptionError(description)).toEqual(DESCRIPTION_TOO_LONG_ERROR);
    });
  });

  describe("description provided is valid", () => {
    test("should return the right value", () => {
      const description = generateValidStringLength({ min_length: MIN_NUM_OF_CHARACTERS_FOR_DESCRIPTION, max_length: MAX_NUM_OF_CHARACTERS_FOR_DESCRIPTION });
      expect(getDescriptionError(description)).toEqual("");
    });
  });
});

describe('getImageError', () => {
  describe('imageUrl provided is empty', () => {
    test('should return the right value', () => {
      expect(getImageError("")).toEqual(NO_IMAGE_URL_PROVIDED_ERROR);
    });
  });

  describe('imageUrl provided is not empty', () => {
    test('should return the right value', () => {
      expect(getImageError("url")).toEqual("");
    });
  });
});

describe('getProvidedURLError', () => {
  describe('provided url is wrong format', () => {
    test('should return the right value', () => {
      expect(getProvidedURLError("google.com")).toEqual(PROVIDED_URL_ERROR);
    });
  });

  describe('provided url is good format', () => {
    test('should return the right value', () => {
      expect(getProvidedURLError("https://www.google.com")).toEqual("");
    });
  });
});
