const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const app = require('../app');
const { createUser, createActivity, removeAllUser, removeAllActivity } = require('./helpers');

chai.use(chaiHttp);

describe('/activities', function() {
	let token = '';
	let activity1Id = '';
	let activity2Id = '';
	let dummyId = '5e5350bbe09ec01d69db66b0';
	let tags1 = [ 'coldplay', 'konser' ];
	let tags2 = [ 'wars', 'star' ];
	const activity1 = {
		title: 'Coldplay',
		description: 'Nonton konser Coldplay',
		image: '',
		memberLimit: 10,
		due_date: '2020-02-25',
		location: 'BSD',
		address: 'Jl. Grand Boulevard',
		tags: JSON.stringify(tags1),
		status: 'open',
		isPromo: true
	};

	const activity2 = {
		title: 'Star Wars',
		description: 'Nonton Star Wars di bioskop',
		image: '',
		memberLimit: 5,
		due_date: '2020-02-27',
		location: 'Pondok Indah',
		address: 'Jl. Sultan Iskandar Muda',
		tags: tags2,
		status: 'open',
		isPromo: false
	};

	const activityCreatorUser = {
		firstName: 'creator',
		email: 'creator@mail.com',
		password: 'asd123'
	};

	const user1Data = {
		firstName: 'user1',
		email: 'user1@mail.com',
		password: 'asd123',
		interests: [ 'javascript', 'react' ]
	};

	const user2Data = {
		firstName: 'user2',
		email: 'user2@mail.com',
		password: 'asd123',
		interests: [ 'programming' ]
	};

	const activity1Data = {
		title: 'activity1',
		description: 'description1'
	};

	let createdUser0, createdUser1, createdUser2;
	let myActivity1;

	before(async function() {
		let userData = {
			firstName: 'John',
			lastName: 'Doe',
			profilePicture: 'sample.png',
			email: 'john@mail.com',
			password: '123456',
			gender: 'male',
			interest: 'javascript',
			phoneNumber: '+6281212341234'
		};
		let data = await createUser(userData);
		token = data.token;

		createdUser0 = await createUser(activityCreatorUser);
		createdUser1 = await createUser(user1Data);
		createdUser2 = await createUser(user2Data);
	});

	after(async function() {
		await removeAllActivity();
		await removeAllUser();
	});

	describe('POST /activities', function() {
		it('should create a new activity - (code: 201)', async function() {
			const response = await chai.request(app).post('/activities').set('token', token).send(activity1);
			activity1Id = response.body.activity._id;
			expect(response).to.have.status(201);
			expect(response.body).to.be.an('object');
			expect(response.body).to.have.property('activity');
			expect(response.body.activity).to.have.property('_id');
			expect(response.body.activity).to.have.property('createdAt');
			expect(response.body.activity).to.have.property('updatedAt');

			expect(response.body.activity.members.length).to.equal(0);
			expect(response.body.activity.pendingInvites.length).to.equal(0);
			expect(response.body.activity.pendingJoins.length).to.equal(0);

			expect(response.body.activity.title).to.equal(activity1.title);
			expect(response.body.activity.description).to.equal(activity1.description);
			expect(response.body.activity.image).to.equal(activity1.image);
			expect(response.body.activity.memberLimit).to.equal(activity1.memberLimit);
			expect(response.body.activity.due_date).to.includes(activity1.due_date);
			expect(response.body.activity.location).to.equal(activity1.location);
			expect(response.body.activity.address).to.equal(activity1.address);
			expect(response.body.activity.tags[0]).to.equal(tags1[0]);
			expect(response.body.activity.tags[1]).to.equal(tags1[1]);
			expect(response.body.activity.status).to.equal(activity1.status);
			expect(response.body.activity.isPromo).to.equal(activity1.isPromo);
		});

		it('should send errors - (Empty body, code: 400)', async function() {
			const data = {};
			const response = await chai.request(app).post('/activities').set('token', token).send(data);

			expect(response).to.have.status(400);
			expect(response.body).to.be.an('object');
			expect(response.body).to.have.property('message');
			expect(response.body.message[0]).to.equal('Title is required');
			expect(response.body.message[1]).to.equal('Description is required');
			//tambah validation2 yg lain
		});

		it('should return error because title is required - (code: 400)', async function() {
			const activityError = {
				title: '',
				description: 'Makan bareng di Hacktiv8',
				image: '',
				memberLimit: 8,
				due_date: '2020-02-28',
				location: 'Hacktiv8',
				address: 'Jl. Sultan No. 7',
				tags: JSON.stringify([ 'makan', 'siang' ]),
				status: 'open',
				isPromo: false
			};
			const response = await chai.request(app).post(`/activities`).send(activityError).set('token', token);

			expect(response).to.have.status(400);
			expect(response.body.message).to.be.an('array');
			expect(response.body.message[0]).to.equal('Title is required');
		});

		it('should return error because title is too long - (code: 400)', async function() {
			const activityError = {
				title: 'Makan Richeese bareng di Hacktiv8',
				description: 'Makan bareng di Hacktiv8',
				image: '',
				memberLimit: 8,
				due_date: '2020-02-28',
				location: 'Hacktiv8',
				address: 'Jl. Sultan No. 7',
				tags: JSON.stringify([ 'makan', 'siang' ]),
				status: 'open',
				isPromo: false
			};
			const response = await chai.request(app).post(`/activities`).send(activityError).set('token', token);

			expect(response).to.have.status(400);
			expect(response.body.message).to.be.an('array');
			expect(response.body.message[0]).to.equal('Title is too long');
		});

		it('should return error because title is too short - (code: 400)', async function() {
			const activityError = {
				title: 'M',
				description: 'Makan bareng di Hacktiv8',
				image: '',
				memberLimit: 8,
				due_date: '2020-02-28',
				location: 'Hacktiv8',
				address: 'Jl. Sultan No. 7',
				tags: JSON.stringify([ 'makan', 'siang' ]),
				status: 'open',
				isPromo: false
			};
			const response = await chai.request(app).post(`/activities`).send(activityError).set('token', token);

			expect(response).to.have.status(400);
			expect(response.body.message).to.be.an('array');
			expect(response.body.message[0]).to.equal('Title is too short');
		});

		it('should return error because description is required - (code: 400)', async function() {
			const activityError = {
				title: 'Makan Richeese',
				description: '',
				image: '',
				memberLimit: 8,
				due_date: '2020-02-28',
				location: 'Hacktiv8',
				address: 'Jl. Sultan No. 7',
				tags: JSON.stringify([ 'makan', 'siang' ]),
				status: 'open',
				isPromo: false
			};
			const response = await chai.request(app).post(`/activities`).send(activityError).set('token', token);

			expect(response).to.have.status(400);
			expect(response.body.message).to.be.an('array');
			expect(response.body.message[0]).to.equal('Description is required');
		});

		it('should return error because description is too short - (code: 400)', async function() {
			const activityError = {
				title: 'Makan Richeese',
				description: 'M',
				image: '',
				memberLimit: 8,
				due_date: '2020-02-28',
				location: 'Hacktiv8',
				address: 'Jl. Sultan No. 7',
				tags: JSON.stringify([ 'makan', 'siang' ]),
				status: 'open',
				isPromo: false
			};
			const response = await chai.request(app).post(`/activities`).send(activityError).set('token', token);

			expect(response).to.have.status(400);
			expect(response.body.message).to.be.an('array');
			expect(response.body.message[0]).to.equal('Description is too short');
		});

		it('should return error because description is too long - (code: 400)', async function() {
			let description = '';
			for (let i = 0; i < 301; i += 1) {
				description += 'a';
			}
			const activityError = {
				title: 'Makan Richeese',
				description,
				image: '',
				memberLimit: 8,
				due_date: '2020-02-28',
				location: 'Hacktiv8',
				address: 'Jl. Sultan No. 7',
				tags: JSON.stringify([ 'makan', 'siang' ]),
				status: 'open',
				isPromo: false
			};
			const response = await chai.request(app).post(`/activities`).send(activityError).set('token', token);

			expect(response).to.have.status(400);
			expect(response.body.message).to.be.an('array');
			expect(response.body.message[0]).to.equal('Description is too long');
		});

		it('should return error because memberLimit is not a number - (code: 400)', async function() {
			const activityError = {
				title: 'Makan Richeese',
				description: 'Makan bareng di Hacktiv8',
				image: '',
				memberLimit: 'a',
				due_date: '2020-02-28',
				location: 'Hacktiv8',
				address: 'Jl. Sultan No. 7',
				tags: JSON.stringify([ 'makan', 'siang' ]),
				status: 'open',
				isPromo: false
			};
			const response = await chai.request(app).post(`/activities`).send(activityError).set('token', token);

			expect(response).to.have.status(400);
			expect(response.body.message).to.be.an('array');
			expect(response.body.message[0]).to.includes('memberLimit');
		});
	});

	describe('GET /activities', function() {
		before(async function() {
			let activity = await createActivity(activity2);
			activity2Id = activity._id;
		});

		it('should get all activity - (code: 200)', async function() {
			const response = await chai.request(app).get('/activities').set('token', token);
			expect(response).to.have.status(200);
			expect(response.body).to.be.an('object');
			expect(response.body).to.have.property('activities');
			expect(response.body.activities).to.be.an('array');
			expect(response.body.activities.length).to.equal(2);

			expect(response.body.activities[1].title).to.equal(activity1.title);
			expect(response.body.activities[1].description).to.equal(activity1.description);
			expect(response.body.activities[1].location).to.equal(activity1.location);
			expect(response.body.activities[1].tags[0]).to.equal(tags1[0]);
			expect(response.body.activities[1].tags[1]).to.equal(tags1[1]);

			expect(response.body.activities[0].title).to.equal(activity2.title);
			expect(response.body.activities[0].description).to.equal(activity2.description);
			expect(response.body.activities[0].location).to.equal(activity2.location);
			expect(response.body.activities[0].tags[0]).to.equal(tags2[0]);
			expect(response.body.activities[0].tags[1]).to.equal(tags2[1]);
		});

		it('should get second page of activities - (code: 200)', async function() {
			const response = await chai.request(app).get('/activities?page=2&limit=1').set('token', token);

			expect(response).to.have.status(200);
			expect(response.body).to.be.an('object');
			expect(response.body).to.have.property('activities');
			expect(response.body.activities).to.be.an('array');
			expect(response.body.activities.length).to.equal(1);

			expect(response.body.activities[0].title).to.equal(activity1.title);
			expect(response.body.activities[0].description).to.equal(activity1.description);
			expect(response.body.activities[0].location).to.equal(activity1.location);
			expect(response.body.activities[0].tags[0]).to.equal(tags1[0]);
			expect(response.body.activities[0].tags[1]).to.equal(tags1[1]);

		});

		it('should get activity with specified interest - (code: 200)', async function() {
			const response = await chai.request(app).get('/activities/interest/star').set('token', token);
			expect(response).to.have.status(200);
			expect(response.body).to.be.an('object');
			expect(response.body).to.have.property('activities');
			expect(response.body.activities).to.be.an('array');
			expect(response.body.activities.length).to.equal(1);

			expect(response.body.activities[0].title).to.equal(activity2.title);
			expect(response.body.activities[0].description).to.equal(activity2.description);
			expect(response.body.activities[0].location).to.equal(activity2.location);
			expect(response.body.activities[0].tags[0]).to.equal(tags2[0]);
			expect(response.body.activities[0].tags[1]).to.equal(tags2[1]);
		});

		it('should get activities with "other" interest - (code: 200)', async function() {
			const response = await chai.request(app).get('/activities/interest/other').set('token', token);
			expect(response).to.have.status(200);
			expect(response.body).to.be.an('object');
			expect(response.body).to.have.property('activities');
			expect(response.body.activities).to.be.an('array');
			expect(response.body.activities.length).to.equal(2);

			expect(response.body.activities[0].title).to.equal(activity1.title);
			expect(response.body.activities[1].title).to.equal(activity2.title);
		});

		it('should get page 2 of activities with "other" interest - (code: 200)', async function() {
			const response = await chai.request(app).get('/activities/interest/other?page=2&limit=1').set('token', token);
			expect(response).to.have.status(200);
			expect(response.body).to.be.an('object');
			expect(response.body).to.have.property('activities');
			expect(response.body.activities).to.be.an('array');
			expect(response.body.activities.length).to.equal(1);

			expect(response.body.activities[0].title).to.equal(activity2.title);
		});


		it('should return user authentication error - (code: 400)', async function() {
			const response = await chai.request(app).get('/activities');

			expect(response).to.have.status(400);
			expect(response.body).to.be.an('object');
			expect(response.body).to.have.property('message');
			expect(response.body.message).to.equal('User authentication error: requires token');
		});

		it('should return one activity with details - (code: 200)', async function() {
			const response = await chai.request(app).get(`/activities/${activity2Id}`).set('token', token);

			expect(response).to.have.status(200);
			expect(response.body.activity.title).to.equal(activity2.title);
			expect(response.body.activity.description).to.equal(activity2.description);
			expect(response.body.activity.location).to.equal(activity2.location);
			expect(response.body.activity.tags[0]).to.equal(tags2[0]);
			expect(response.body.activity.tags[1]).to.equal(tags2[1]);
		});

		it('should return invalid ID error - (code: 400)', async function() {
			const response = await chai.request(app).get(`/activities/invalidID`).set('token', token);

			expect(response).to.have.status(400);
			expect(response.body.message).to.equal('Invalid ObjectId');
		});
	});

	describe('PATCH /activities', function() {
		it('should return edited activity - (code: 200)', async function() {
			const activityEdit = {
				title: 'Makan Richeese',
				description: 'Makan bareng di Hacktiv8',
				image: '',
				memberLimit: 8,
				due_date: '2020-02-28',
				location: 'Hacktiv8',
				address: 'Jl. Sultan No. 7',
				tags: JSON.stringify([ 'makan', 'siang' ]),
				status: 'open',
				isPromo: true
			};
			const response = await chai
				.request(app)
				.patch(`/activities/${activity1Id}`)
				.send(activityEdit)
				.set('token', token);
			expect(response).to.have.status(200);
			expect(response.body.activity.title).to.equal(activityEdit.title);
			expect(response.body.activity.memberLimit).to.equal(activityEdit.memberLimit);
			expect(response.body.activity.location).to.equal(activityEdit.location);
		});

		it('should return activity with changed title - (code: 200)', async function() {
			const activityEdit = {
				title: 'Makan KFC'
			};
			const response = await chai
				.request(app)
				.patch(`/activities/${activity1Id}`)
				.send(activityEdit)
				.set('token', token);
			expect(response).to.have.status(200);
			expect(response.body.activity.title).to.equal(activityEdit.title);
		});

		it('should return activity with changed description - (code: 200)', async function() {
			const activityEdit = {
				description: 'Makan bareng teman di KFC'
			};
			const response = await chai
				.request(app)
				.patch(`/activities/${activity1Id}`)
				.send(activityEdit)
				.set('token', token);
			expect(response).to.have.status(200);
			expect(response.body.activity.description).to.equal(activityEdit.description);
		});

		it('should return error because title is too short - (code: 400)', async function() {
			const activityEdit = {
				title: 'M',
				description: 'Makan bareng di Hacktiv8',
				image: '',
				memberLimit: 8,
				due_date: '2020-02-28',
				location: 'Hacktiv8',
				address: 'Jl. Sultan No. 7',
				tags: JSON.stringify([ 'makan', 'siang' ]),
				status: 'open',
				isPromo: false
			};
			const response = await chai
				.request(app)
				.patch(`/activities/${activity1Id}`)
				.send(activityEdit)
				.set('token', token);

			expect(response).to.have.status(400);
			expect(response.body.message).to.be.an('array');
			expect(response.body.message[0]).to.equal('Title is too short');
		});

		it('should return error because invalid date - (code: 400)', async function() {
			const activityEdit = {
				title: 'Makan Richeese',
				description: 'Makan bareng di Hacktiv8',
				image: '',
				memberLimit: 8,
				due_date: '2020-02-281',
				location: 'Hacktiv8',
				address: 'Jl. Sultan No. 7',
				tags: JSON.stringify([ 'makan', 'siang' ]),
				status: 'open',
				isPromo: false
			};
			const response = await chai
				.request(app)
				.patch(`/activities/${activity1Id}`)
				.send(activityEdit)
				.set('token', token);

			expect(response).to.have.status(400);
			expect(response.body.message).to.equal('Invalid date');
		});
	});

	describe('POST /activities/commit', function() {
		it('should change activity status to commit- (code: 200)', async function() {
			const response = await chai.request(app).post(`/activities/commit/${activity1Id}`).set('token', token);

			expect(response).to.have.status(200);
			expect(response.body.activity.status).to.equal('commit');
		});

		it('should change activity status to cancelled - (code: 200)', async function() {
			const response = await chai.request(app).patch(`/activities/cancel/${activity1Id}`).set('token', token);
			expect(response).to.have.status(200);
			expect(response.body.activity.status).to.equal('cancelled');
		});

		it('should return activity is not found - (code: 401)', async function() {
			const response = await chai.request(app).post(`/activities/commit/${dummyId}`).set('token', token);

			expect(response).to.have.status(401);
			expect(response.body.message).to.equal('Activity authorization failed / activity cannot be found');
		});
	});
	describe('GET /getRecommendedActivities', function() {
		it('should get recommended activities for current logged in user - (code: 200)', async function() {
			const response = await chai.request(app).get(`/activities/getRecommendedActivities?page=1&limit=1`).set('token', token);

			expect(response).to.have.status(200);
			expect(response.body.activities[0].title).to.equal('Star Wars');
		});
	});
});
