import React from "react";
import Flag from "react-world-flags";
import Link from "next/link";

const CountryListItem = ({ country }) => {
  const { id, country: countryName } = country;
  return (
    <Link as={`/country/${id}`} href={`/country?countryCode=${id}`}>
      <a className="country-list-item halfwidth py2 px2 no-text-decoration text-dark-grey">
        <div className="flex px1 py1 justify-content--between border align-items--center">
          <span className="h2 favourite-font-weight">{countryName}</span>
          <Flag code={id} height="64" />
        </div>
      </a>
    </Link>
  );
};

export default CountryListItem;
