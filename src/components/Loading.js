import React from 'react';

const Loading = ({ size }) => (
  <img className={`loader--${size}`} src="/static/images/loader.gif" />
);

export default Loading;
