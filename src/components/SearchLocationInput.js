import React from "react";
import PlacesAutocomplete from "react-places-autocomplete";

import Loading from "./Loading";

class SearchLocationInput extends React.Component {
  render() {
    return (
      <div>
        <PlacesAutocomplete
          value={this.props.value}
          onChange={this.props.handleChange}
          onSelect={this.props.onSelect}
        >
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading
          }) => (
            <div className="relative">
              {loading && (
                <div className="absolute my1 ml1">
                  <Loading size="small" />
                </div>
              )}
              <input
                {...getInputProps({
                  placeholder: "Add Location",
                  className: "text-input"
                })}
              />
              <div className="search-location-input__dropdown-container">
                {suggestions.map(suggestion => {
                  const className = suggestion.active
                    ? "search-location-input__suggestion-item search-location-input__suggestion-item--active"
                    : "search-location-input__suggestion-item";
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: "#fafafa", cursor: "pointer" }
                    : { backgroundColor: "#ffffff", cursor: "pointer" };
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style
                      })}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
      </div>
    );
  }
}

export default SearchLocationInput;
