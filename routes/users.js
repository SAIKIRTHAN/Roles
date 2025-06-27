var express = require('express');
var router = express.Router();
const user = require('../controllers/users')
const auth = require('../Middleware/auth')

/* GET users listing. */
// router.get('/', function (req, res, next) {
//   res.send('respond with a resource');
// });
router.post('/', user.createUser)
router.get('/all',  user.getAllUsers)
router.get('/', auth.authenticate, user.getUserById)
router.delete('/', auth.authenticate, user.deleteUserById)
router.put('/', auth.authenticate, user.updateUser)
router.post('/login', user.login)
router.get('/search',user.getUsersByNameSearch)
router.post('/send-otp',user.sendOtp)
router.post('/verify-otp',user.verifyOtp)

module.exports = router;
