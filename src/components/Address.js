import React from "react";
import { MdMyLocation } from "react-icons/md";

const Address = ({ iconClassName, addressClassName, address }) => (
  <div className="flex align-items--center">
    <MdMyLocation className={iconClassName ? iconClassName : ''} />
    <span className={addressClassName ? addressClassName : ''}>{address}</span>
  </div>
);

export default Address;
