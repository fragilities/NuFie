const router = require('express').Router();
const ActivityController = require('../controllers/ActivityController.js');
const {
	userAuthentication,
	activityAuthorization,
	activityMemberAuthorization,
	activityPendingAuthorization
} = require('../middlewares/auth');
const { singleUpload } = require('../services/imageUpload');

router.use(userAuthentication);

router.post('/', singleUpload, ActivityController.create);
router.get('/', ActivityController.read);
router.get('/getRecommendedActivities', userAuthentication, ActivityController.getRecommendedActivities);
router.get('/interest/:interest', ActivityController.getByInterest);
router.get('/:id', ActivityController.readOne);
router.patch('/:id', activityAuthorization, singleUpload, ActivityController.updateOne);
router.post('/commit/:id', activityAuthorization, ActivityController.commit);
router.patch('/cancel/:id', activityAuthorization, ActivityController.cancel);
router.post('/invite/:id', activityAuthorization, ActivityController.invite);
router.post('/inviteAccept/:id', activityPendingAuthorization, ActivityController.inviteAccept);
router.post('/inviteReject/:id', activityPendingAuthorization, ActivityController.inviteReject);
router.post('/kick/:id', activityAuthorization, ActivityController.kick);
router.post('/join/:id', ActivityController.join);
router.post('/joinAccept/:id', activityAuthorization, ActivityController.joinAccept);
router.post('/joinReject/:id', activityAuthorization, ActivityController.joinReject);
router.post('/leave/:id', activityMemberAuthorization, ActivityController.leave);
router.post('/chatNotification', ActivityController.chatNotification);
// router.delete('/:id', activityAuthorization, ActivityController.deleteOne);

module.exports = router;
