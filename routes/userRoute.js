const router = require('./routes');

const UserController = require('../controller/userController');

router.post('/user', UserController.create);

router.get('/user', UserController.findAll);

router.get('/user/:id', UserController.findById);

router.put('/user/:id', UserController.UpdateById);

router.delete('/user/:id', UserController.deleteById);

module.exports = router;