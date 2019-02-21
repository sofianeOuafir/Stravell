import React from "react";
import Link from "next/link";

import Place from "./Place";

const CountryListItem = ({ country }) => {
  const { id, country: countryName } = country;
  return (
    <Link as={`/country/${id}`} href={`/country?countryCode=${id}`}>
      <a className="country-list-item halfwidth py2 px2 no-text-decoration text-dark-grey">
        <Place
          containerClassName="px1 border-light-grey"
          placeName={countryName}
          countryCode={id}
          placeNameClassName="h2 favourite-font-weight"
          flagSize="64"
        />
      </a>
    </Link>
  );
};

export default CountryListItem;
