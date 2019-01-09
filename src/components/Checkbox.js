import React from "react";
import uuid from 'uuid';
class Checkbox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const id = uuid();
    return (
      <div>
        <input
          id={id}
          name={id}
          className="mr1"
          onChange={this.props.handleChange}
          type="checkbox"
          checked={this.props.checked}
        />
        <label htmlFor={id}>{ this.props.label }</label>
      </div>
    );
  }
}

export default Checkbox;
