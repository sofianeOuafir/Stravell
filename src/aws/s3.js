import AWS from 'aws-sdk';

// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'us-east-2'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
	IdentityPoolId: 'us-east-2:a3099d42-9e75-4cdd-9a2c-f98f1910a001',
	secretAccessKey: 'v2Lnz+hqw8Qx3/9nczJhuXxt0+iN/ODxGOnER77H',
	accessKeyId: 'AKIAJ6I5JNB3MIDRFGVQ'
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
				reject(`There was an error uploading your photo`);
			} else {
				resolve(data);
			}
		});
	});
}

