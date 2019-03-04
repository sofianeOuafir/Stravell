import React, { Component } from "react";
import CountryListItem from "./CountryListItem";

class CountryList extends Component {
  static getVisibleData = (countries, { text }) => {
    text = text.toLowerCase();
    return countries.filter(country => {
      const matchText = country.country.toLowerCase().includes(text);
      return matchText;
    });
  };

  render() {
    const { data, noDataText } = this.props;
    return data.length > 0 ? (
      <div className="flex flex-wrap">
        {data.map((country, key) => (
          <CountryListItem key={key} index={key} country={country} />
        ))}
      </div>
    ) : (
      <h2 className="favourite-font-weight">{noDataText}</h2>
    );
  }
}

export default CountryList;
