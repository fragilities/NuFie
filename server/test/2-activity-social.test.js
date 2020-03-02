const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const app = require('../app');
const { removeAllUser, createUser, createActivity, removeAllActivity } = require('./helpers');

chai.use(chaiHttp);

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
let activity1, activity2;

describe('/activities - Social', function() {
	before(async function() {
		createdUser0 = await createUser(activityCreatorUser);
		createdUser1 = await createUser(user1Data);
		createdUser2 = await createUser(user2Data);
	});

	after(async function() {
		await removeAllUser();
		await removeAllActivity();
	});

	describe('Invite a user to an activity: POST /activities/invite/:id', function() {
		it('Should return an error Activity authorization failed - status 401', async function() {
			let tempResp = await chai
				.request(app)
				.post('/activities')
				.set({ token: createdUser0.token })
				.send(activity1Data);

			activity1 = tempResp.body.activity;

			const resp = await chai
				.request(app)
				.post(`/activities/inviteReject/${activity1._id}`)
				.set({ token: createdUser1.token });

			expect(resp).to.have.status(401);
			expect(resp.body.message).to.equal('Activity authorization failed');
		});

		it('Should return an updated activity object where the pendingInvites containing the target userId - status 200', async function() {
			const resp = await chai
				.request(app)
				.post(`/activities/invite/${activity1._id}`)
				.set({ token: createdUser0.token })
				.send({ targetId: createdUser1.user._id });

			expect(resp).to.have.status(200);
			expect(resp.body.activity.pendingInvites[0]).to.equal(createdUser1.user._id.toString());
		});

		it('Should return an error response User authentication error: requires token - status 400', async function() {
			const resp = await chai
				.request(app)
				.post(`/activities/invite/${activity1._id}`)
				.send({ targetId: createdUser1.user._id });

			expect(resp).to.have.status(400);
			expect(resp.body.message).to.equal('User authentication error: requires token');
		});
	});

	describe('Invited user rejects an invitation: POST /activities/inviteReject/:id', function() {
		it('Should return an updated activity where the pendingInvites is an array containing nothing - status 200', async function() {
			const resp = await chai
				.request(app)
				.post(`/activities/inviteReject/${activity1._id}`)
				.set({ token: createdUser1.token });

			expect(resp).to.have.status(200);
			expect(resp.body.activity.pendingInvites.length).to.equal(0);
		});

		it('Should return an error response User authentication error: requires token - status 400', async function() {
			const resp = await chai.request(app).post(`/activities/inviteReject/${activity1._id}`);

			expect(resp).to.have.status(400);
			expect(resp.body.message).to.equal('User authentication error: requires token');
		});
	});

	describe('Invited user accepts an invitation: POST /activities/inviteAccept/:id', function() {
		it('Should return an updated activity where the pendingInvites is an array that contains nothing and members contain the invited userId - status 200', async function() {
			await chai
				.request(app)
				.post(`/activities/invite/${activity1._id}`)
				.set({ token: createdUser0.token })
				.send({ targetId: createdUser1.user._id });

			const resp = await chai
				.request(app)
				.post(`/activities/inviteAccept/${activity1._id}`)
				.set({ token: createdUser1.token });

			expect(resp).to.have.status(200);
			expect(resp.body.activity.pendingInvites.length).to.equal(0);
			expect(resp.body.activity.members[0]).to.equal(createdUser1.user._id.toString());
		});

		it('Should return an error response User authentication error: requires token - status 400', async function() {
			await chai
				.request(app)
				.post(`/activities/invite/${activity1._id}`)
				.set({ token: createdUser0.token })
				.send({ targetId: createdUser1.user._id });

			const resp = await chai.request(app).post(`/activities/inviteAccept/${activity1._id}`);

			expect(resp).to.have.status(400);
			expect(resp.body.message).to.equal('User authentication error: requires token');
		});
	});

	describe('Invite a member to an activity: POST /activities/invite/:id', function() {
		it('Should return an error because the invited user is already a member - status 400', async function() {
			const resp = await chai
				.request(app)
				.post(`/activities/invite/${activity1._id}`)
				.set({ token: createdUser0.token })
				.send({ targetId: createdUser1.user._id });

			expect(resp).to.have.status(400);
			expect(resp.body.message).to.equal('You already have invited this user to this activity');
		});

		it('Should return an error response User authentication error: requires token - status 400', async function() {
			const resp = await chai
				.request(app)
				.post(`/activities/invite/${activity1._id}`)
				.send({ targetId: createdUser1.user._id });

			expect(resp).to.have.status(400);
			expect(resp.body.message).to.equal('User authentication error: requires token');
		});
	});

	describe('Activity owner kicks an activity member: POST /activities/kick/:id', function() {
		it('Should return an updated activity where the members array contains nothing - status 200', async function() {
			const resp = await chai
				.request(app)
				.post(`/activities/kick/${activity1._id}`)
				.set({ token: createdUser0.token })
				.send({ targetId: createdUser1.user._id });

			expect(resp).to.have.status(200);
			expect(resp.body.activity.members.length).to.equal(0);
		});

		it('Should return an error response User authentication error: requires token - status 400', async function() {
			const resp = await chai
				.request(app)
				.post(`/activities/kick/${activity1._id}`)
				.send({ targetId: createdUser1.user._id });

			expect(resp).to.have.status(400);
			expect(resp.body.message).to.equal('User authentication error: requires token');
		});
	});

	describe('A user send a join request to an activity: POST /activities/join/:id', function() {
		it('Should return an updated activity where the pendingJoins array contains the joining userId - status 200', async function() {
			const resp = await chai
				.request(app)
				.post(`/activities/join/${activity1._id}`)
				.set({ token: createdUser1.token });

			expect(resp).to.have.status(200);
			expect(resp.body.activity.pendingJoins[0]).to.equal(createdUser1.user._id.toString());
		});

		it('Should return an error response User authentication error: requires token - status 400', async function() {
			const resp = await chai.request(app).post(`/activities/join/${activity1._id}`);

			expect(resp).to.have.status(400);
			expect(resp.body.message).to.equal('User authentication error: requires token');
		});
	});

	describe('A user join request is getting rejected: POST /activities/joinReject/:id', function() {
		it('Should return an updated activity where the pendingJoins array contains nothing - status 200', async function() {
			const resp = await chai
				.request(app)
				.post(`/activities/joinReject/${activity1._id}`)
				.set({ token: createdUser0.token })
				.send({ targetId: createdUser1.user._id });

			expect(resp).to.have.status(200);
			expect(resp.body.activity.pendingJoins.length).to.equal(0);
		});

		it('Should return an error response User authentication error: requires token - status 400', async function() {
			const resp = await chai
				.request(app)
				.post(`/activities/joinReject/${activity1._id}`)
				.send({ targetId: createdUser1.user._id });

			expect(resp).to.have.status(400);
			expect(resp.body.message).to.equal('User authentication error: requires token');
		});
	});

	describe('A user join request is getting accepted: POST /activities/joinAccept/:id', function() {
		it('Should return an updated activity where the pendingJoins array contains nothing and members[0] contains the joining userId - status 200', async function() {
			await chai.request(app).post(`/activities/join/${activity1._id}`).set({ token: createdUser1.token });

			const resp = await chai
				.request(app)
				.post(`/activities/joinAccept/${activity1._id}`)
				.set({ token: createdUser0.token })
				.send({ targetId: createdUser1.user._id });

			expect(resp).to.have.status(200);
			expect(resp.body.activity.members[0]).to.equal(createdUser1.user._id.toString());
		});

		it('Should return an error response User authentication error: requires token - status 400', async function() {
			const resp = await chai
				.request(app)
				.post(`/activities/joinAccept/${activity1._id}`)
				.send({ targetId: createdUser1.user._id });

			expect(resp).to.have.status(400);
			expect(resp.body.message).to.equal('User authentication error: requires token');
		});
	});

	describe('Accepting a user join request that is not in pending join: POST /activities/joinAccept/:id', function() {
		it('Should return an error because the user is not in pending join list - status 400', async function() {
			const resp = await chai
				.request(app)
				.post(`/activities/joinAccept/${activity1._id}`)
				.set({ token: createdUser0.token })
				.send({ targetId: createdUser1.user._id });

			expect(resp).to.have.status(400);
			expect(resp.body.message).to.equal('The user you want to accept is not in pending join');
		});

		it('Should return an error response User authentication error: requires token - status 400', async function() {
			const resp = await chai
				.request(app)
				.post(`/activities/joinAccept/${activity1._id}`)
				.send({ targetId: createdUser1.user._id });

			expect(resp).to.have.status(400);
			expect(resp.body.message).to.equal('User authentication error: requires token');
		});
	});

	describe('A user leave an activity on their own: POST /activities/leave/:id', function() {
		it('Should return an updated activity where the members array contains nothing - status 200', async function() {
			const resp = await chai
				.request(app)
				.post(`/activities/leave/${activity1._id}`)
				.set({ token: createdUser1.token });

			expect(resp).to.have.status(200);
			expect(resp.body.activity.members.length).to.equal(0);
		});

		it('Should return an error Activity authorization failed - status 401', async function() {
			const resp = await chai
				.request(app)
				.post(`/activities/leave/${activity1._id}`)
				.set({ token: createdUser1.token });

			expect(resp).to.have.status(401);
			expect(resp.body.message).to.equal('Activity authorization failed');
		});

		it('Should return an error response User authentication error: requires token - status 400', async function() {
			const resp = await chai.request(app).post(`/activities/leave/${activity1._id}`);

			expect(resp).to.have.status(400);
			expect(resp.body.message).to.equal('User authentication error: requires token');
		});
	});
});
