import React from "react";

class CommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: (props.comment && props.comment.text) || ""
    };
  }

  onTextChange = e => {
    const text = e.target.value;
    this.setState(() => ({ text }));
  };

  onSubmit = () => {
    console.log(this.state.text);
  };

  render() {
    return (
      <div>
        <input type="text" onChange={this.onTextChange} />
        <button onClick={this.onSubmit}>Submit</button>
      </div>
    );
  }
}

export default CommentForm;
