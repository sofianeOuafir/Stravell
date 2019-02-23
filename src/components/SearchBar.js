import React, { Fragment } from "react";
import { connect } from "react-redux";
import { IoIosSearch } from "react-icons/io";
import { setTextFilter } from "./../actions/filters";

export class SearchBar extends React.Component {
  constructor(props) {
    super(props);
  }

  onTextChange = e => this.props.setTextFilter(e.target.value);

  render() {
    const { placeholder, className, autoFocus, filters } = this.props;
    return (
      <Fragment>
        <IoIosSearch className="search-bar__icon" />
        <input
          id="searchBarInput"
          type="text"
          autoComplete="off"
          placeholder={placeholder ? placeholder : "Search"}
          className={className}
          autoFocus={autoFocus}
          value={filters.text}
          onChange={this.onTextChange}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  filters: state.filters
});

const mapDispatchToProps = dispatch => ({
  setTextFilter: text => dispatch(setTextFilter(text))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchBar);
