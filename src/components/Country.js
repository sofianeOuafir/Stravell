import React from "react";
import Flag from "react-world-flags";

const Country = ({
  countryName,
  countryNameClassName,
  countryCode,
  flagSize,
  containerClassName
}) => {
  containerClassName = containerClassName ? containerClassName : "";
  flagSize = flagSize ? flagSize : 12;
  countryNameClassName = countryNameClassName ? countryNameClassName : "";
  return (
    <div
      className={`flex px1 py1 justify-content--between align-items--center ${containerClassName}`}
    >
      <span className={countryNameClassName}>{countryName}</span>
      <Flag code={countryCode} height={flagSize} />
    </div>
  );
};

export default Country;
