import AWS from 'aws-sdk';

// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'us-east-2'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
	IdentityPoolId: '',
	secretAccessKey: '',
	accessKeyId: ''
});

const s3 = new AWS.S3({
  params: {Bucket: 'astalavista-blog'}
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

