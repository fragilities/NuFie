const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamp = require('mongoose-timestamp2');
const { hashPassword } = require('../helpers/bcrypt');

const userSchema = new Schema({
	firstName: {
		type: String,
		required: [ true, 'First name cannot be empty' ],
		minlength: [ 2, 'First name minimum lenght is 2' ]
	},
	lastName: {
		type: String
	},
	profilePicture: {
		type: String
	},
	aboutMe: {
		type: String,
		default: ''
	},
	gender: {
		type: String
	},
	email: {
		type: String,
		required: [ true, 'Email has been registered in our server' ],
		validate: [
			{
				validator: function(v) {
					return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
						v
					);
				},
				message: 
				/*istanbul ignore next*/
				(props) => `The email must be in a valid email format`
			},
			{
				validator: async function(v) {
					const user = await mongoose.models.User.findOne({ email: v });
					/*istanbul ignore next*/
					if (user) return false;
					else return true;
				},
				message: 
				/*istanbul ignore next*/
				(props) => `This email has been registered`
			}
		]
	},
	password: {
		type: String,
		required: [ true, 'Password cannot be empty' ]
	},
	phoneNumber: {
		type: String,
		validate: {
			validator: function(v) {
				return /^\+62[0-9]{8,}$/.test(v);
			},

			message: 
			/*istanbul ignore next*/
			(props) =>
				`The phone number must start with "+62", contain only numbers, and 10 digit minimum length`
		}
	},
	interests: {
		type: [ String ],
		default: []
	},
	posts: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Activity'
		}
	],
	pushToken: {
		type: String,
		default: ''
	}
});

userSchema.plugin(timestamp);

userSchema.pre('save', function(next) {
	this.password = hashPassword(this.password);
	next();
});

// userSchema.pre('findOneAndDelete', function(next) {
// 	next();
// });

const User = mongoose.model('User', userSchema);

module.exports = User;
