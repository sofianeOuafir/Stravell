import React from "react";
import { MdMyLocation } from "react-icons/md";
import Link from "next/link";
import { slugify } from "underscore.string";

import { getPlaceIdFromLatLng } from "./../lib/utils/place";

const Address = ({ iconClassName, addressClassName, address, lat, lng }) => {
  const placeId = getPlaceIdFromLatLng({ lat, lng });
  return (
    <div className="flex align-items--center">
      <Link
        href={`/place?id=${placeId}`}
        as={`/place/${slugify(address)}/${placeId}`}
      >
        <div>
          <MdMyLocation className={iconClassName ? iconClassName : ""} />
          <span className={addressClassName ? addressClassName : ""}>
            {address}
          </span>
        </div>
      </Link>
    </div>
  );
};

export default Address;
