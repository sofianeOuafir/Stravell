import React from "react";
import { MdMyLocation } from "react-icons/md";
import Link from "next/link";
import { slugify } from "underscore.string";

import { getPlaceIdFromLatLng } from "./../lib/utils/place";

const Address = ({ iconClassName, addressClassName, address, lat, lng }) => {
  const placeId = getPlaceIdFromLatLng({ lat, lng });
  return (
    <Link
      href={`/place?id=${placeId}`}
      as={`/place/${slugify(address)}/${placeId}`}
    >
      <div className="flex align-items--center">
        <MdMyLocation className={iconClassName ? iconClassName : ""} />
        <span className={addressClassName ? addressClassName : ""}>
          {address}
        </span>
      </div>
    </Link>
  );
};

export default Address;
