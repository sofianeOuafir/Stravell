import React from "react";
import { MdMyLocation } from "react-icons/md";

const Address = (props) => (
  <div className="flex align-items--center">
    <MdMyLocation className={`mr1 ml1 ${props.iconClassName}`} />
    <span className={props.addressClassName}>{props.address}</span>
  </div>
);

export default Address;
