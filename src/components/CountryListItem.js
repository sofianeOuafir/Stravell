import React from "react";
import Link from "next/link";

import Place from "./Place";
import { isMultipleOfThree } from "./../lib/utils/math";

const CountryListItem = ({ country, index }) => {
  const { id, country: countryName } = country;
  return (
    <Link as={`/country/${id}`} href={`/country?countryCode=${id}`}>
      <a className={`country-list-item py2 no-text-decoration text-dark-grey ${isMultipleOfThree(index + 1) ? "" : "pr1"}`}>
        <Place
          containerClassName="px1 border-light-grey"
          placeName={countryName}
          countryCode={id}
          placeNameClassName="h2 favourite-font-weight"
          flagSize="45"
        />
      </a>
    </Link>
  );
};

export default CountryListItem;
