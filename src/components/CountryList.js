import React from "react";
import CountryListItem from './CountryListItem';

const CountryList = ({ countries }) => (
  <div className="flex flex-wrap">
    {countries.map((country) => (
      <CountryListItem key={country.id} country={country} />
    ))}
  </div>
);

export default CountryList;
