import AWS from 'aws-sdk';

// Initialize the Amazon Cognito credentials provider
AWS.config.region = process.env.S3_BUCKET_REGION;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
	IdentityPoolId: process.env.S3_IDENTITY_POOL_ID,
	secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
	accessKeyId: process.env.S3_ACCESS_KEY_ID
});

const s3 = new AWS.S3({
  params: {Bucket: process.env.S3_BUCKET_NAME}
});

export const uploadFile = (file) => {
	const albumName = 'pictures'
	const { name: fileName } = file;
  var albumPhotosKey = encodeURIComponent(albumName) + '/';
	var photoKey = albumPhotosKey + fileName;
	
	return new Promise((resolve, reject) => {
		s3.upload({
			Key: photoKey,
			Body: file,
			ACL: 'public-read'
		}, function(err, data) {
			if (err) {
				reject(`There was an error when trying to upload your image`);
			} else {
				resolve(data);
			}
		});
	});
}

