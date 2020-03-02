const multer = require('multer');
const multers3 = require('multer-s3');
const aws = require('aws-sdk');

aws.config.update({
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	region: process.env.AWS_REGION
});

const s3 = new aws.S3();
/* istanbul ignore next */
const upload = multer({
	storage: multers3({
		s3,
		bucket: 'zoezachary',
		acl: 'public-read',
		metadata: function(req, file, cb) {
			cb(null, { fieldName: file.fieldname });
		},
		key: function(req, file, cb) {
			cb(null, new Date().getTime().toString() + file.originalname);
		}
	})
});

const singleUpload = upload.single('image');

module.exports = { singleUpload };
