import { titleize, capitalize } from "underscore.string";
import validator from 'validator';

import {
  MIN_NUM_OF_CHARACTERS_FOR_TITLE,
  MAX_NUM_OF_CHARACTERS_FOR_TITLE,
  MIN_NUM_OF_CHARACTERS_FOR_DESCRIPTION,
  MAX_NUM_OF_CHARACTERS_FOR_DESCRIPTION,
  MIN_NUM_OF_CHARACTERS_FOR_BODY,
  DESCRIPTION_TOO_SHORT_ERROR,
  DESCRIPTION_TOO_LONG_ERROR,
  TITLE_TOO_SHORT_ERROR,
  TITLE_TOO_LONG_ERROR
} from "./../../constants/constants";

export const formatTitle = title => {
  return titleize(title).trim();
};

export const formatDescription = description => {
  return capitalize(description).trim();
};

const formatBody = body => {
  return body.trim();
}

export const getBodyError = body => {
  const formattedBody = formatBody(body);
  if(formattedBody.length === 0) {
    return "You should provide a content to your post.";
  } else if (formattedBody.length < MIN_NUM_OF_CHARACTERS_FOR_BODY) {
    return `The post content should be minimum ${MIN_NUM_OF_CHARACTERS_FOR_BODY} characters long`;
  } else {
    return "";
  }
}

export const getTitleError = title => {
  const formattedTitle = formatTitle(title);
  if (formattedTitle.length === 0) {
    return "You should provide a title";
  } else if (formattedTitle.length < MIN_NUM_OF_CHARACTERS_FOR_TITLE) {
    return TITLE_TOO_SHORT_ERROR;
  } else if (formattedTitle.length > MAX_NUM_OF_CHARACTERS_FOR_TITLE) {
    return TITLE_TOO_LONG_ERROR;
  } else {
    return "";
  }
};

export const getDescriptionError = description => {
  const formattedDescription = formatDescription(description);
  if (formattedDescription.length === 0) {
    return "You should provide a description";
  } else if (formattedDescription.length < MIN_NUM_OF_CHARACTERS_FOR_DESCRIPTION) {
    return DESCRIPTION_TOO_SHORT_ERROR;
  } else if (formattedDescription.length > MAX_NUM_OF_CHARACTERS_FOR_DESCRIPTION) {
    return DESCRIPTION_TOO_LONG_ERROR;
  } else {
    return "";
  }
};

export const getImageError = imageUrl => {
  const formattedImageUrl = imageUrl.trim();
  if(formattedImageUrl.length === 0) {
    return "You should provide an image";
  }

  return "";
};

export const getProvidedURLError = providedURL => {
  if(validator.isURL(providedURL, { require_protocol: true })){
    return "";
  }

  return "The URL format provided is not correct (should be in format http://www.google.com)";
}

