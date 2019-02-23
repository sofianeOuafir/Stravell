import React from "react";
import { connect } from "react-redux";
import Toggle from "react-toggle";

import SearchBar from "./SearchBar";
import PostList from "./PostList";
import GoogleMaps from "./GoogleMaps";
import BreadCrumb from "./Breadcrumb";
import { setMapVisibility } from "./../actions/map";

export class FilterableDataList extends React.Component {
  constructor(props) {
    super(props);
  }

  noDataText() {
    const { data, filteredData, noDataText, filters } = this.props;
    if (data.length === 0) {
      return noDataText;
    } else if (filteredData.length === 0) {
      return `No results were found for: ${filters.text}`;
    }
  }

  render() {
    const {
      breadCrumbProps,
      googleMapsProps,
      map,
      setMapVisibility,
      DataList,
      withMap = true
    } = this.props;
    return (
      <div className="flex flex-direction--column">
        <div className="flex justify-content--between align-items--center mb1">
          <BreadCrumb {...breadCrumbProps} />
          {withMap && (
            <div className="flex align-items--center show-for-laptop">
              <label
                className="mr1 c-warm-peach favourite-font-weight"
                htmlFor="showMap"
              >
                Show Map
              </label>
              <Toggle
                id="showMap"
                defaultChecked={map.visible}
                onChange={() => setMapVisibility(!this.props.map.visible)}
              />
            </div>
          )}
        </div>
        <div className="flex">
          <div
            className={`filterable-post-list__list-container ${
              withMap && map.visible ? "pr1" : ""
            }`}
          >
            {this.props.data.length > 0 && (
              <div className={`search-bar-container`}>
                <SearchBar
                  className="search-bar"
                  autoFocus={true}
                />
              </div>
            )}
            <DataList
              editable={this.props.editable}
              data={this.props.filteredData}
              noDataText={this.noDataText()}
            />
          </div>

          {withMap && map.visible && (
            <div className="filterable-post-list__map-container">
              <GoogleMaps {...googleMapsProps} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setMapVisibility: visible => dispatch(setMapVisibility(visible))
});

const mapStateToProps = ({ filters, map }, { data, DataList }) => {
  return {
    data,
    filteredData: DataList.getVisibleData(data, filters),
    filters,
    map
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterableDataList);
