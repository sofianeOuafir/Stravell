import React from "react";
import Flag from "react-world-flags";
import Link from "next/link";

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
      className={`flex py1 justify-content--between align-items--center ${containerClassName}`}
    >
      <span className={placeNameClassName}>{placeName}</span>
      <Link href={`/country?countryCode=${countryCode}`} as={`/country/${countryCode}`}>
        <Flag code={countryCode} height={flagSize} />
      </Link>
    </div>
  );
};

export default Place;
