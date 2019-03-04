import React from "react";
import Link from "next/link";
import { slugify } from "underscore.string";
import Place from "./Place";

const RegionListItem = ({ region, index }) => {
  const { id, region: regionName, country, countryCode } = region;
  return (
    <Link as={`/region/${slugify(country)}/${id}`} href={`/region?regionCode=${id}`}>
      <a
        className={`country-list-item py2 no-text-decoration text-dark-grey pr1`}
      >
        <Place
          containerClassName="px1 border-light-grey"
          placeName={regionName}
          countryCode={countryCode}
          placeNameClassName="h3 favourite-font-weight"
          flagSize="45"
        />
      </a>
    </Link>
  );
};

export default RegionListItem;
