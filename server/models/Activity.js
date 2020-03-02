const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamp = require('mongoose-timestamp2');

const activitySchema = new Schema({
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	title: {
		type: String,
		required: [ true, 'Title is required' ],
		minlength: [ 2, 'Title is too short' ],
		maxlength: [ 30, 'Title is too long' ]
	},
	description: {
		type: String,
		required: [ true, 'Description is required' ],
		minlength: [ 2, 'Description is too short' ],
		maxlength: [ 300, 'Description is too long' ]
	},
	image: {
		type: String
	},
	category: {
		type: String,
		default: 'other'
	},
	members: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	],
	memberLimit: {
		type: Number
	},
	pendingInvites: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	],
	pendingJoins: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	],
	due_date: {
		type: Date
	},
	location: {
		type: String
	},
	address: {
		type: String
	},
	tags: [ String ],
	status: {
		type: String,
		default: 'open'
	},
	isPromo: {
		type: Boolean,
		default: false
	}
});

activitySchema.plugin(timestamp);

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
