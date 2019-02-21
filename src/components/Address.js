import React, { Fragment } from "react";
import { MdMyLocation } from "react-icons/md";
import Link from "next/link";

import { getPlaceIdFromLatLng } from "./../lib/utils/place";

const Address = ({ iconClassName, addressClassName, address, lat, lng }) => (
  <div className="flex align-items--center">
    <Link href={`/place?id=${getPlaceIdFromLatLng({ lat, lng })}`}>
      <a className="no-text-decoration text-dark-grey">
        <MdMyLocation className={iconClassName ? iconClassName : ""} />
        <span className={addressClassName ? addressClassName : ""}>
          {address}
        </span>
      </a>
    </Link>
  </div>
);

export default Address;
