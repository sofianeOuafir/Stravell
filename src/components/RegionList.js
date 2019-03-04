import React, { Component } from "react";
import RegionListItem from "./RegionListItem";

class RegionList extends Component {
  static getVisibleData = (regions, { text }) => {
    text = text.toLowerCase();
    return regions.filter(region => {
      const matchText = region.region.toLowerCase().includes(text);
      return matchText;
    });
  };

  render() {
    const { data, noDataText } = this.props;
    return data.length > 0 ? (
      <div className="flex flex-wrap">
        {data.map((region, key) => (
          <RegionListItem key={key} index={key} region={region} />
        ))}
      </div>
    ) : (
      <h2 className="favourite-font-weight">{noDataText}</h2>
    );
  }
}

export default RegionList;
