import React from "react";
import { connect } from "react-redux";
import { IoIosSearch } from "react-icons/io";
import { setTextFilter } from './../actions/filters';

class SearchBar extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      placeholder: this.props.placeholder ? this.props.placeholder : 'Search',
      className: this.props.className ? this.props.className : 'search-bar'
    }
  }

  onTextChange = e => this.props.setTextFilter(e.target.value);
  
  render () {
    return (
      <div className="search-bar__container">
        <IoIosSearch className="search-bar__icon" />
        <input type="text" placeholder={this.state.placeholder} className={this.state.className} autoFocus={this.props.autoFocus} value={this.props.filters.text} onChange={this.onTextChange} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    filters: state.filters
  };
};

const mapDispatchToProps = dispatch => ({
  setTextFilter: text => dispatch(setTextFilter(text))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);