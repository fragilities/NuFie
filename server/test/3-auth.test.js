const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const app = require('../app');
const { removeAllUser, createUser, createActivity, removeAllActivity } = require('./helpers');

chai.use(chaiHttp);

describe('Authentication and Authorization', function () {
  describe('User Routes', function () {
    it('should return token required error - status 400', async function () {
      const resp = await chai
        .request(app)
        .get(`/users`)

      expect(resp).to.have.status(400);
      expect(resp.body.message).to.equal('User authentication error: requires token');
    })
  })

  describe('Activity Routes', function () {
    it('should return token required error - status 200', async function() {
      const resp = await chai
        .request(app)
        .get(`/activities`)

      expect(resp).to.have.status(400);
      expect(resp.body.message).to.equal('User authentication error: requires token');
    });

    it('should return token required error - status 200', async function() {
      const resp = await chai
        .request(app)
        .get(`/activities`)

      expect(resp).to.have.status(400);
      expect(resp.body.message).to.equal('User authentication error: requires token');
    });
  })
})