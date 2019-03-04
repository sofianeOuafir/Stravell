import React from "react";
import { MdMyLocation } from "react-icons/md";
import Link from "next/link";
import { slugify } from "underscore.string";

const Address = ({ iconClassName = "", addressClassName = "", address, placeId }) => {
  return (
    <Link
      href={`/place?id=${placeId}`}
      as={`/place/${slugify(address)}/${placeId}`}
    >
      <a className="flex align-items--center">
        <MdMyLocation className={iconClassName} />
        <span className={addressClassName}>
          {address}
        </span>
      </a>
    </Link>
  );
};

export default Address;
