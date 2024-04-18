const express = require('express');
const controller2 = require('../controllers/userController');
const {isGuest, isLoggedIn} = require('../middleware/auth');

const router = express.Router();


router.get('/new', isGuest, controller2.new);

//POST /users: create a new user account
router.post('/', isGuest, controller2.create);

//GET /users/login: send html for logging in
router.get('/login', isGuest, controller2.getUserLogin);

//POST /users/login: authenticate user's login
router.post('/login', isGuest, controller2.login);

//GET /users/profile: send user's profile page
router.get('/profile', isLoggedIn, controller2.profile);

//POST /users/logout: logout a user
router.get('/logout', isLoggedIn, controller2.logout);

module.exports = router;