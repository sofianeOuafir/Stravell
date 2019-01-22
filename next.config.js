const withCSS = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
const webpack = require('webpack');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: '.env.test' });
} else if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: '.env.development' });
}

module.exports = withCSS(withSass({
  webpack(config) {
    config.plugins.push(new webpack.DefinePlugin({
      'process.env.FIREBASE_API_KEY': JSON.stringify(process.env.FIREBASE_API_KEY),
      'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
      'process.env.FIREBASE_DATABASE_URL': JSON.stringify(process.env.FIREBASE_DATABASE_URL),
      'process.env.FIREBASE_PROJECT_ID': JSON.stringify(process.env.FIREBASE_PROJECT_ID),
      'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
      'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
      'process.env.S3_BUCKET_REGION': JSON.stringify(process.env.S3_BUCKET_REGION),
      'process.env.S3_IDENTITY_POOL_ID': JSON.stringify(process.env.S3_IDENTITY_POOL_ID),
      'process.env.S3_SECRET_ACCESS_KEY': JSON.stringify(process.env.S3_SECRET_ACCESS_KEY),
      'process.env.S3_ACCESS_KEY_ID': JSON.stringify(process.env.S3_ACCESS_KEY_ID),
      'process.env.S3_BUCKET_NAME': JSON.stringify(process.env.S3_BUCKET_NAME),
      'process.env.GA_TRACKING_CODE': JSON.stringify(process.env.GA_TRACKING_CODE),
      'process.env.FIREBASE_ADMIN_TYPE': JSON.stringify(process.env.FIREBASE_ADMIN_TYPE),
      'process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID': JSON.stringify(process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID),
      'process.env.FIREBASE_ADMIN_PRIVATE_KEY': JSON.stringify(process.env.FIREBASE_ADMIN_PRIVATE_KEY),
      'process.env.FIREBASE_ADMIN_CLIENT_EMAIL': JSON.stringify(process.env.FIREBASE_ADMIN_CLIENT_EMAIL),
      'process.env.FIREBASE_ADMIN_CLIENT_ID': JSON.stringify(process.env.FIREBASE_ADMIN_CLIENT_ID),
      'process.env.FIREBASE_ADMIN_AUTH_URI': JSON.stringify(process.env.FIREBASE_ADMIN_AUTH_URI),
      'process.env.FIREBASE_ADMIN_TOKEN_URI': JSON.stringify(process.env.FIREBASE_ADMIN_TOKEN_URI),
      'process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL': JSON.stringify(process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL),
      'process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL': JSON.stringify(process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL)
    }));

    return config
  }
}));