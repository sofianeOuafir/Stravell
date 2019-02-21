import React from "react";
import Flag from "react-world-flags";

const Place = ({
  placeName,
  placeNameClassName,
  countryCode,
  flagSize,
  containerClassName
}) => {
  containerClassName = containerClassName ? containerClassName : "";
  flagSize = flagSize ? flagSize : 12;
  placeNameClassName = placeNameClassName ? placeNameClassName : "";
  return (
    <div
      className={`flex px1 py1 justify-content--between align-items--center ${containerClassName}`}
    >
      <span className={placeNameClassName}>{placeName}</span>
      <Flag code={countryCode} height={flagSize} />
    </div>
  );
};

export default Place;
