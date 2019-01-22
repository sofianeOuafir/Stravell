import React from 'react';

const LoadingPage = ({ size }) => (
  <img className={`loader--${size}`} src="/static/images/loader.gif" />
);

export default LoadingPage;
