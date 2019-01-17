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
    return (
      <div className="search-bar__container">
        <IoIosSearch className="search-bar__icon" />
        <input
          id="searchBarInput"
          type="text"
          placeholder={
            this.props.placeholder ? this.props.placeholder : "Search"
          }
          className={this.props.className ? this.props.className : "search-bar"}
          autoFocus={this.props.autoFocus}
          value={this.props.filters.text}
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
