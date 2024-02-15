// Initialize express router
const express = require('express');
const router = express.Router();

// initialize controller
const userController = require('../controllers/user.controller');

// define routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.put('/change-password', userController.changePassword);
router.post('/logout', userController.logout);

// export router
module.exports = router;