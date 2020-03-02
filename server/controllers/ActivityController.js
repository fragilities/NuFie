const Activity = require('../models/Activity.js');
const User = require('../models/User.js');
const axios = require('axios');
const mongoose = require('mongoose');

class ActivityController {
	static async create(req, res, next) {
		try {
			const owner = req.userId;
			const { title, description, memberLimit, due_date, location, address, status } = req.body;

			/*istanbul ignore next*/
			const image = req.file && req.file.location ? req.file.location : '';
			const tags = req.body && req.body.tags && req.body.tags != '[]' ? JSON.parse(req.body.tags) : [];
			let isPromo = undefined;
			/*istanbul ignore next*/
			if (req.body && req.body.isPromo) {
				if (req.body.isPromo == 'false') isPromo = false;
				else isPromo = true;
			}
			const activity = await Activity.create({
				owner,
				title,
				description,
				image,
				memberLimit,
				due_date,
				location,
				address,
				tags,
				status,
				isPromo
			});

			await User.updateOne(
				{ _id: req.userId },
				{
					$push: {
						posts: activity._id
					}
				}
			);

			res.status(201).json({ activity });
		} catch (error) {
			next(error);
		}
	}

	static async read(req, res, next) {
		try {
			const limit = req.query && req.query.limit ? +req.query.limit : 10;
			const page = req.query && req.query.page ? +req.query.page : 1;

			const activities = await Activity.find()
				.limit(limit)
				.skip(limit * (page - 1))
				.populate('owner', '-password -posts')
				.populate('pendingJoins', '-password -posts')
				.sort({ updatedAt: -1 });

			res.status(200).json({ activities });
		} catch (error) {
			/*istanbul ignore next*/
			next(error);
		}
	}

	static async getByInterest(req, res, next) {
		try {
			const limit = req.query && req.query.limit ? +req.query.limit : 10;
			const page = req.query && req.query.page ? +req.query.page : 1;
			const interest = req.params && req.params.interest ? req.params.interest : 'other';

			let filter = {};

			if (interest.toLowerCase() == 'other') {
				filter = {
					tags: {
						$nin: [ 'music', 'movie', 'sports', 'traveling', 'food' ]
					}
				};
			} else {
				filter = {
					owner: { $ne: req.userId },
					tags: new RegExp(`^${interest}$`, 'i')
				};
			}

			const activities = await Activity.find(filter)
				.limit(limit)
				.skip(limit * (page - 1))
				.populate('owner', '-password');
			res.status(200).json({ activities });
		} catch (error) {
			/*istanbul ignore next*/
			next(error);
		}
	}

	static async getRecommendedActivities(req, res, next) {
		try {
			const limit = req.query && req.query.limit ? +req.query.limit : 10;
			const page = req.query && req.query.page ? +req.query.page : 1;
			console.log(limit, page)
			const skip = limit * (page - 1);
			const user = await User.findById(req.userId);

			const activities = await Activity.aggregate([
				{
					$addFields: {
						weight: {
							$size: {
								$setIntersection: [ '$tags', user.interests ]
							}
						}
					}
				},
				{
					$match: {
						owner: {
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
			await Activity.populate(activities, { path: 'owner', select: '-password' });
			res.status(200).json({ activities });
		} catch (error) {
			/*istanbul ignore next*/
			next(error);
		}
	}

	static async readOne(req, res, next) {
		try {
			const activity = await Activity.findById(req.params.id)
				.populate('owner', '-password -posts')
				.populate('members', '-password -posts')
				.populate('pendingInvites', '-password -posts')
				.populate('pendingJoins', '-password -posts');

			res.status(200).json({ activity });
		} catch (error) {
			next(error);
		}
	}

	static async updateOne(req, res, next) {
		try {
			const { title, description, memberLimit, due_date, location, address } = req.body;
			/*istanbul ignore next*/
			const image = req.file && req.file.location ? req.file.location : null;
			/*istanbul ignore next*/
			const tags = req.body && req.body.tags && req.body.tags != '[]' ? JSON.parse(req.body.tags) : null;
			let isPromo = undefined;
			/*istanbul ignore next*/
			if (req.body && req.body.isPromo) {
				if (req.body.isPromo == 'false') isPromo = false;
				else isPromo = true;
			}
			const inputs = {};
			if (title) inputs.title = title;
			if (description) inputs.description = description;
			/*istanbul ignore next*/
			if (image) inputs.image = image;
			if (memberLimit) inputs.memberLimit = memberLimit;
			if (due_date) inputs.due_date = due_date;
			if (location) inputs.location = location;
			if (address) inputs.address = address;
			if (tags) inputs.tags = tags;
			if (isPromo) inputs.isPromo = isPromo;
			const activity = await Activity.findByIdAndUpdate(req.params.id, inputs, {
				new: true,
				runValidators: true
			});

			res.status(200).json({ activity });
		} catch (error) {
			next(error);
		}
	}

	static async commit(req, res, next) {
		try {
			const status = 'commit';
			const activity = await Activity.findByIdAndUpdate(req.params.id, { status }, { new: true });

			const { pushTokens } = req.body;
			/* istanbul ignore next */
			if (pushTokens) {
				pushTokens.forEach((pushToken) => {
					axios.post(
						`https://exp.host/--/api/v2/push/send`,
						{
							to: pushToken,
							title: 'Activity plan has been finalized'
						},
						{
							host: 'exp.host',
							accept: 'application/json',
							'accept-encoding': 'gzip, deflate',
							'content-type': 'application/json'
						}
					);
				});
			}

			res.status(200).json({ activity });
		} catch (error) {
			/*istanbul ignore next*/
			next(error);
		}
	}

	static async cancel(req, res, next) {
		try {
			const activity = await Activity.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });

			const { pushTokens } = req.body;
			/* istanbul ignore next */
			if (pushTokens) {
				pushTokens.forEach((pushToken) => {
					axios.post(
						`https://exp.host/--/api/v2/push/send`,
						{
							to: pushToken,
							title: 'Activity plan has been cancelled'
						},
						{
							host: 'exp.host',
							accept: 'application/json',
							'accept-encoding': 'gzip, deflate',
							'content-type': 'application/json'
						}
					);
				});
			}

			res.status(200).json({ activity });
		} catch (error) {
			/*istanbul ignore next*/
			next(error);
		}
	}

	static async invite(req, res, next) {
		try {
			const { targetId } = req.body;

			let activity = await Activity.findOne({
				members: targetId
			});

			if (activity)
				throw {
					errorCode: 400,
					message: 'You already have invited this user to this activity'
				};

			activity = await Activity.findByIdAndUpdate(
				req.params.id,
				{ $addToSet: { pendingInvites: targetId } },
				{ new: true }
			);

			const { pushToken } = req.body;

			axios.post(
				`https://exp.host/--/api/v2/push/send`,
				{
					to: pushToken,
					title: 'You have been invited into an activity'
				},
				{
					host: 'exp.host',
					accept: 'application/json',
					'accept-encoding': 'gzip, deflate',
					'content-type': 'application/json'
				}
			);

			res.status(200).json({ activity });
		} catch (error) {
			next(error);
		}
	}

	static async inviteAccept(req, res, next) {
		try {
			const activity = await Activity.findByIdAndUpdate(
				req.params.id,
				{
					$addToSet: { members: req.userId },
					$pull: { pendingInvites: req.userId }
				},
				{ new: true }
			).populate('owner', 'pushToken');

			const user = await User.findOne({ _id: req.userId }).select('firstName');

			axios.post(
				`https://exp.host/--/api/v2/push/send`,
				{
					to: activity.owner.pushToken,
					title: `${user.firstName} has accepted your invitation`
				},
				{
					host: 'exp.host',
					accept: 'application/json',
					'accept-encoding': 'gzip, deflate',
					'content-type': 'application/json'
				}
			);

			res.status(200).json({ activity });
		} catch (error) {
			/*istanbul ignore next*/
			next(error);
		}
	}

	static async inviteReject(req, res, next) {
		try {
			const activity = await Activity.findByIdAndUpdate(
				req.params.id,
				{ $pull: { pendingInvites: req.userId } },
				{ new: true }
			).populate('owner', 'pushToken');

			const user = await User.findOne({ _id: req.userId }).select('firstName');

			axios.post(
				`https://exp.host/--/api/v2/push/send`,
				{
					to: activity.owner.pushToken,
					title: `${user.firstName} has rejected your invitation`
				},
				{
					host: 'exp.host',
					accept: 'application/json',
					'accept-encoding': 'gzip, deflate',
					'content-type': 'application/json'
				}
			);

			res.status(200).json({ activity });
		} catch (error) {
			/*istanbul ignore next*/
			next(error);
		}
	}
	/*istanbul ignore next*/
	static async chatNotification(req, res, next) {
		try {
			const { title, body, pushTokens } = req.body;

			pushTokens.forEach((pushToken) => {
				axios.post(
					`https://exp.host/--/api/v2/push/send`,
					{
						to: pushToken,
						title: `You have new message on ${title}`,
						body
					},
					{
						host: 'exp.host',
						accept: 'application/json',
						'accept-encoding': 'gzip, deflate',
						'content-type': 'application/json'
					}
				);
			});

			res.status(200).json({ message: 'OK' });
		} catch (error) {
			next(error);
		}
	}

	static async kick(req, res, next) {
		try {
			const { targetId } = req.body;
			const activity = await Activity.findByIdAndUpdate(
				req.params.id,
				{ $pull: { members: targetId } },
				{ new: true }
			);

			const { pushToken } = req.body;

			axios.post(
				`https://exp.host/--/api/v2/push/send`,
				{
					to: pushToken,
					title: `You have been kicked from "${activity.title}"`
				},
				{
					host: 'exp.host',
					accept: 'application/json',
					'accept-encoding': 'gzip, deflate',
					'content-type': 'application/json'
				}
			);

			res.status(200).json({ activity });
		} catch (error) {
			/*istanbul ignore next*/
			next(error);
		}
	}

	static async join(req, res, next) {
		try {
			const activity = await Activity.findByIdAndUpdate(
				req.params.id,
				{ $addToSet: { pendingJoins: req.userId } },
				{ new: true }
			);

			const user = await User.findById(req.userId).select('firstName lastName');
			const { pushToken } = req.body;

			axios.post(
				`https://exp.host/--/api/v2/push/send`,
				{
					to: activity.owner.pushToken,
					title: `${user.firstName} ${user.lastName} is requesting to join "${activity.title}"`
				},
				{
					host: 'exp.host',
					accept: 'application/json',
					'accept-encoding': 'gzip, deflate',
					'content-type': 'application/json'
				}
			);
			res.status(200).json({ activity });
		} catch (error) {
			/*istanbul ignore next*/
			next(error);
		}
	}

	static async joinAccept(req, res, next) {
		try {
			const { targetId } = req.body;

			let activity = await Activity.findOne({
				_id: req.params.id,
				pendingJoins: targetId
			});
			if (!activity)
				throw {
					errorCode: 400,
					message: 'The user you want to accept is not in pending join'
				};

			activity = await Activity.findByIdAndUpdate(
				req.params.id,
				{
					$addToSet: { members: targetId },
					$pull: { pendingJoins: targetId }
				},
				{ new: true }
			);
			const { pushToken } = req.body;

			axios.post(
				`https://exp.host/--/api/v2/push/send`,
				{
					to: pushToken,
					title: `You have been accepted to join "${activity.title}"`
				},
				{
					host: 'exp.host',
					accept: 'application/json',
					'accept-encoding': 'gzip, deflate',
					'content-type': 'application/json'
				}
			);
			res.status(200).json({ activity });
		} catch (error) {
			next(error);
		}
	}

	static async joinReject(req, res, next) {
		try {
			const { targetId } = req.body;

			const activity = await Activity.findByIdAndUpdate(
				req.params.id,
				{
					$pull: {
						pendingJoins: targetId
					}
				},
				{ new: true }
			);
			const { pushToken } = req.body;

			axios.post(
				`https://exp.host/--/api/v2/push/send`,
				{
					to: pushToken,
					title: `You have been rejected to join "${activity.title}"`
				},
				{
					host: 'exp.host',
					accept: 'application/json',
					'accept-encoding': 'gzip, deflate',
					'content-type': 'application/json'
				}
			);
			res.status(200).json({ activity });
		} catch (error) {
			/*istanbul ignore next*/
			next(error);
		}
	}

	static async leave(req, res, next) {
		try {
			const activity = await Activity.findByIdAndUpdate(
				req.params.id,
				{ $pull: { members: req.userId } },
				{ new: true }
			);
			const user = await User.findById(req.userId).select('firstName lastName');
			const { pushToken } = req.body;

			axios.post(
				`https://exp.host/--/api/v2/push/send`,
				{
					to: activity.owner.pushToken,
					title: `${user.firstName} ${user.lastName} has leave "${activity.title}"`
				},
				{
					host: 'exp.host',
					accept: 'application/json',
					'accept-encoding': 'gzip, deflate',
					'content-type': 'application/json'
				}
			);
			res.status(200).json({ activity });
		} catch (error) {
			/*istanbul ignore next*/
			next(error);
		}
	}
}

module.exports = ActivityController;
