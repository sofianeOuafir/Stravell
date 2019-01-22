// if (process.env.NODE_ENV === 'test') {
//   const file
//   require('dotenv').config({ path: '.env.test' });
// } else if (process.env.NODE_ENV === 'development') {
//   require('dotenv').config({ path: '.env.development' });
// }


// const env = process.env.NODE_ENV === 'development'
require('dotenv').config({ path: '.env.development' });
module.exports = {
  'process.env.FIREBASE_API_KEY': JSON.stringify(process.env.FIREBASE_API_KEY),
  'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
  'process.env.FIREBASE_DATABASE_URL': process.env.FIREBASE_DATABASE_URL,
  'process.env.FIREBASE_PROJECT_ID': JSON.stringify(process.env.FIREBASE_PROJECT_ID),
  'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
  'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
  'process.env.S3_BUCKET_REGION': JSON.stringify(process.env.S3_BUCKET_REGION),
  'process.env.S3_IDENTITY_POOL_ID': JSON.stringify(process.env.S3_IDENTITY_POOL_ID),
  'process.env.S3_SECRET_ACCESS_KEY': JSON.stringify(process.env.S3_SECRET_ACCESS_KEY),
  'process.env.S3_ACCESS_KEY_ID': JSON.stringify(process.env.S3_ACCESS_KEY_ID),
  'process.env.S3_BUCKET_NAME': JSON.stringify(process.env.S3_BUCKET_NAME),
  'process.env.GA_TRACKING_CODE': JSON.stringify(process.env.GA_TRACKING_CODE)
}
