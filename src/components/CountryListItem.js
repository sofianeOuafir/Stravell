import React from "react";
import Link from "next/link";

import Country from "./Country";

const CountryListItem = ({ country }) => {
  const { id, country: countryName } = country;
  return (
    <Link as={`/country/${id}`} href={`/country?countryCode=${id}`}>
      <a className="country-list-item thirdwidth py2 px2 no-text-decoration text-dark-grey">
        <Country
          containerClassName="border-light-grey"
          countryName={countryName}
          countryCode={id}
          countryNameClassName="h2 favourite-font-weight"
          flagSize="64"
        />
      </a>
    </Link>
  );
};

export default CountryListItem;
