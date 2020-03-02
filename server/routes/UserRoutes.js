const router = require('express').Router();
const UserController = require('../controllers/UserController.js');
const { userAuthentication, activityAuthorization } = require('../middlewares/auth.js');
const { singleUpload } = require('../services/imageUpload');

router.post('/signIn', UserController.signIn);
/* istanbul ignore next */
router.post('/savePushToken', UserController.savePushToken);
router.post('/register', UserController.register);
router.post('/googleRegister', UserController.registerWithGoogle);
router.post('/login', UserController.login);
router.post('/googleLogin', UserController.loginWithGoogle);
router.use(userAuthentication);
router.get('/', UserController.readSelf);
router.post('/getByMostMatchingInterests', UserController.getByMostMatchingInterests);
router.get('/:id', UserController.readOne);
router.patch('/', singleUpload, UserController.updateOne);
router.delete('/', UserController.deleteOne);

module.exports = router;
