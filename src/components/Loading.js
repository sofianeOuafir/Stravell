import React from 'react';

const LoadingPage = ({ size }) => (
  <img className={`loader--${size}`} src="/images/loader.gif" />
);

export default LoadingPage;
