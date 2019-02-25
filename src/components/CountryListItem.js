import React from "react";
import Link from "next/link";

import Place from "./Place";

const CountryListItem = ({ country, index }) => {
  const { id, country: countryName } = country;
  return (
    <Link as={`/country/${id}`} href={`/country?countryCode=${id}`}>
      <a className={`country-list-item py2 no-text-decoration text-dark-grey`}>
        <Place
          containerClassName="px1 border-light-grey"
          placeName={countryName}
          countryCode={id}
          placeNameClassName="h3 favourite-font-weight"
          flagSize="45"
        />
      </a>
    </Link>
  );
};

export default CountryListItem;
