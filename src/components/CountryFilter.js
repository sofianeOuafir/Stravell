import React from "react";
import { connect } from 'react-redux';
import { setCountryFilter } from './../actions/filters'

const CountryFilter = ({ countries, setCountryFilter, filters }) => (
  <div>
    {countries && (
      <select name="countryFilter" id="countryFilter" value={filters.country} onChange={(e) => onCountryChange(e, setCountryFilter)}>
      <option value="">All Countries</option>  
      {countries.map(({ id, country }) => (
          <option key={id} value={id}>{country}</option>
        ))}
      </select>
    )}
  </div>
);

const onCountryChange = (e, setCountryFilter) => {
  const countryCode = e.target.value;
  setCountryFilter(countryCode)
}

const mapDispatchToProps = (dispatch) => ({
  setCountryFilter: country => dispatch(setCountryFilter(country))
});

const mapStateToProps = ({ countries, filters }) => ({
  countries,
  filters
});

export default connect(mapStateToProps, mapDispatchToProps)(CountryFilter);
