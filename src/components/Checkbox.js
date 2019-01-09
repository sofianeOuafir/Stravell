import React from "react";

class Checkbox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <input
          className="mr1"
          onChange={this.props.handleChange}
          type="checkbox"
          checked={this.props.checked}
        />
        <label>{ this.props.label }</label>
      </div>
    );
  }
}

export default Checkbox;
