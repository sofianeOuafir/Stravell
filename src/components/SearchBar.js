import React from "react";
import { connect } from "react-redux";
import { IoIosSearch } from "react-icons/io";
import { setTextFilter } from "./../actions/filters";

export class SearchBar extends React.Component {
  constructor(props) {
    super(props);
  }

  onTextChange = e => this.props.setTextFilter(e.target.value);

  render() {
    const { containerClassName, placeholder, className,autoFocus, filters } = this.props;
    return (
      <div className={`search-bar__container ${containerClassName ? containerClassName : ''}`}>
        <IoIosSearch className="search-bar__icon" />
        <input
          id="searchBarInput"
          type="text"
          placeholder={
            placeholder ? placeholder : "Search"
          }
          className={className ? className : "search-bar"}
          autoFocus={autoFocus}
          value={filters.text}
          onChange={this.onTextChange}
        />
      </div>
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
