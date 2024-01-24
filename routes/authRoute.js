const router = require('./routes');

const AuthController = require('../controller/authController');

router.post('/signin', AuthController.signIn);

module.exports = router;