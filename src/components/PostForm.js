import React from 'react';
import moment from 'moment';

class PostForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      title: props.post && props.post.title || '',
      body: props.post && props.post.body || '',
      createdAt: props.post && moment(props.post.createdAt) || moment(),
      updatedAt: moment(),
      uid: props.post && props.post.uid || props.uid 
    }
  }

  onTitleChange = (e) => {
    const title = e.target.value;
    this.setState(() => ({ title }))
  };

  onBodyChange = (e) => {
    const body = e.target.value;
    this.setState(() => ({ body }))
  };

  onSubmit = (e) => {
    e.preventDefault();
    if(this.state.title != '' && this.state.body != '') {
      this.props.onSubmit({
        title: this.state.title,
        body: this.state.body,
        createdAt: this.state.createdAt,
        updatedAt: this.state.updatedAt,
        uid: this.state.uid
      });
    } else {
      this.setState((params) => ({ error: 'Please provide a title and a body' }));
    }

  }

  render () {
    return (
      <form onSubmit={this.onSubmit}>
      {!!this.state.error && <p>{ this.state.error }</p>}
      <input type="text" onChange={this.onTitleChange} autoFocus value={this.state.title} />
      <textarea onChange={this.onBodyChange} value={this.state.body}></textarea>
      <button>Save Post</button>
    </form>
    )
  }
}

export default PostForm;