import React, { Fragment } from "react";
import { connect } from "react-redux";
import { setCountryFilter } from "./../actions/filters";

const CountryFilter = ({ countries, setCountryFilter, filters, className }) => (
  <Fragment>
    {countries && (
      <select
        className={className}
        name="countryFilter"
        id="countryFilter"
        value={filters.countryCode}
        onChange={e => onCountryChange(e, setCountryFilter)}
      >
        <option value="">All Countries</option>
        {countries.map(({ id, country }) => (
          <option key={id} value={id}>
            {country}
          </option>
        ))}
      </select>
    )}
  </Fragment>
);

const onCountryChange = (e, setCountryFilter) => {
  const countryCode = e.target.value;
  setCountryFilter(countryCode);
};

const mapDispatchToProps = dispatch => ({
  setCountryFilter: country => dispatch(setCountryFilter(country))
});

const mapStateToProps = ({ countries, filters }) => ({
  countries,
  filters
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CountryFilter);
