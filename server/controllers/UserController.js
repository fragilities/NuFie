const User = require('../models/User.js');
const admin = require('../services/firebase-admin');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const axios = require('axios');
/*istanbul ignore next*/
class UserController {
	static async signIn(req, res, next) {
		try {
			const decodedToken = await admin.auth().verifyIdToken(req.body.idToken);
			const email = decodedToken.email;
			const { firstName, lastName, password, gender, phoneNumber } = req.body;
			const interests = req.body && req.body.interests ? req.body.interests : [];

			const inputs = {};
			let user;
			let statusCode;

			if (!firstName) {
				// login

				user = await User.findOne({ email });
				statusCode = 200;
			} else {
				// register

				const profilePicture = req.file && req.file.location ? req.file.location : '';

				user = await User.create({
					firstName,
					lastName,
					profilePicture,
					email,
					password,
					gender,
					interests,
					phoneNumber
				});

				statusCode = 201;
			}

			const payload = {
				userId: user._id
			};

			const token = jwt.sign(payload, process.env.JWT_SECRET);

			res.status(statusCode).json({ token, userId: user._id });
		} catch (error) {
			next(error);
		}
	}

	static async savePushToken(req, res, next) {
		try {
			const { pushToken, userId } = req.body;
			const user = await User.findByIdAndUpdate(userId, { pushToken }, { new: true });

			axios.post(
				`https://exp.host/--/api/v2/push/send`,
				{
					to: `ExponentPushToken[${pushToken}]`,
					title: 'testing',
					body: 'this is body'
				},
				{
					host: 'exp.host',
					accept: 'application/json',
					'accept-encoding': 'gzip, deflate',
					'content-type': 'application/json'
				}
			);

			res.status(200).json({ user });
		} catch (error) {
			next(error);
		}
	}

	static async register(req, res, next) {
		try {
			const decodedToken = await admin.auth().verifyIdToken(req.body.idToken);

			const email = decodedToken.email;

			const { firstName, lastName, password, gender, interest, phoneNumber } = req.body;

			const profilePicture = req.file && req.file.location ? req.file.location : '';

			const user = await User.create({
				firstName,
				lastName,
				profilePicture,
				email,
				password,
				gender,
				interest,
				phoneNumber
			});

			const payload = {
				userId: user._id
			};

			const token = jwt.sign(payload, process.env.JWT_SECRET);

			res.status(201).json({ token, userId: user._id });
		} catch (error) {
			next(error);
		}
	}

	static async registerWithGoogle(req, res, next) {
		try {
			const client = new OAuth2Client(process.env.GOOGLE_SIGNIN_CLIENTID);

			const ticket = await client.verifyIdToken({
				idToken: req.body.idToken,
				audience: process.env.GOOGLE_SIGNIN_CLIENTID
			});

			const payload = ticket.getPayload();
			const email = payload.email;
			const password = Math.random().toString(36).slice(-8);
			const firstName = payload.given_name;
			const lastName = payload.family_name ? payload.family_name : '';
			const profilePicture = payload.picture ? payload.picture : '';

			const user = await User.create({
				email,
				password,
				firstName,
				lastName,
				profilePicture
			});

			const jwtPayload = {
				userId: user._id
			};

			const token = jwt.sign(jwtPayload, process.env.JWT_SECRET);

			res.status(201).json({ token, userId: user._id });
		} catch (error) {
			next(error);
		}
	}

	static async login(req, res, next) {
		try {
			const { idToken } = req.body;

			const decodedToken = await admin.auth().verifyIdToken(idToken);

			const user = await User.findOne({ email: decodedToken.email });

			const payload = {
				userId: user._id
			};

			const token = jwt.sign(payload, process.env.JWT_SECRET);
			res.status(200).json({ token, user: user._id });
		} catch (error) {
			next(error);
		}
	}

	static async loginWithGoogle(req, res, next) {
		try {
			const client = new OAuth2Client(process.env.GOOGLE_SIGNIN_CLIENTID);

			const ticket = await client.verifyIdToken({
				idToken: req.body.idToken,
				audience: process.env.GOOGLE_SIGNIN_CLIENTID
			});

			const payload = ticket.getPayload();
			const user = await User.findOne({ email: payload.email });

			if (!user)
				throw {
					errorCode: 400,
					message: 'Login with google has failed. Bad idToken'
				};

			const tokenPayload = {
				userId: user._id
			};

			const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);
			res.status(200).json({ token, user: user._id });
		} catch (error) {
			next(error);
		}
	}

	static async create(req, res, next) {
		try {
			const { firstName, lastName, profilePicture, email, password, gender, interest } = req.body;

			const user = await User.create({
				firstName,
				lastName,
				profilePicture,
				email,
				password,
				gender,
				interest
			});

			res.status(201).json({ user });
		} catch (error) {
			next(error);
		}
	}

	// To fetch other's profile
	static async readOne(req, res, next) {
		try {
			const user = await User.findById(req.params.id);
			res.status(200).json({ user });
		} catch (error) {
			next(error);
		}
	}

	static async readSelf(req, res, next) {
		try {
			const user = await User.findById(req.userId).populate('posts');
			res.status(200).json({ user });
		} catch (error) {
			next(error);
		}
	}

	static async getByMostMatchingInterests(req, res, next) {
		try {
			const limit = req.query && req.query.limit ? +req.query.limit : 10;
			const page = req.query && req.query.page ? +req.query.page : 1;
			const tags = req.body && req.body.tags ? req.body.tags : [];
                        const skip = limit * (page-1)
			const users = await User.aggregate([
				{
					$addFields: {
						weight: {
							$size: {
								$setIntersection: [ '$interests', tags ]
							}
						}
					}
				},
				{
					$match: {
						_id: {
							$ne: mongoose.Types.ObjectId(req.userId)
						}
					}
				},
				{
					$sort: {
						weight: -1
					}
				},
				{
					$skip: skip
				},
				{
					$limit: limit
				}
			]);
                        
			res.status(200).json({ users, userId: req.userId });
		} catch (error) {
			next(error);
		}
	}

	static async updateOne(req, res, next) {
		try {
			const { firstName, lastName, password, gender, phoneNumber, aboutMe } = req.body;

			const interests =
				req.body && req.body.interests && req.body.interests != '[]' ? JSON.parse(req.body.interests) : null;

			const inputs = {};
			if (firstName) inputs.firstName = firstName;
			if (lastName) inputs.lastName = lastName;
			if (req.file && req.file.location) inputs.profilePicture = req.file.location;
			if (password) inputs.password = password;
			if (gender) inputs.gender = gender;
			if (phoneNumber && phoneNumber != 'undefined') inputs.phoneNumber = phoneNumber;
			if (interests) inputs.interests = interests;
			if (aboutMe) inputs.aboutMe = aboutMe;

			const user = await User.findByIdAndUpdate({ _id: req.userId }, inputs, {
				new: true,
				runValidators: true
			});

			res.status(200).json({ user });
		} catch (error) {
			next(error);
		}
	}

	static async deleteOne(req, res, next) {
		try {
			const user = await User.findByIdAndDelete(req.userId);
			if (!user) {
				throw {
					errorCode: 400,
					message: 'User not found'
				};
			}
			res.status(200).json({ user });
		} catch (error) {
			next(error);
		}
	}
}

module.exports = UserController;
