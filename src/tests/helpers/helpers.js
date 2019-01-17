export const generateTooShortString = length => {
  let word = "";
  for (var i = 0; i < length - 1; i++) {
    word += "a";
  }
  return word;
};

export const generateTooLongString = length => {
  let word = "";
  for (var i = 0; i < length + 1; i++) {
    word += "a";
  }
  return word;
};

export const generateValidStringLength = ({ min_length, max_length }) => {
  if(!min_length && min_length !== 0) {
    return generateTooShortString(max_length);
  } else if(!max_length && max_length !== 0) {
    return generateTooLongString(min_length);
  } else {
    const length = (min_length + max_length / 2);
    let word = "";
    for (var i = 0; i < length; i++) {
      word += "a";
    }
    return word;
  }
};