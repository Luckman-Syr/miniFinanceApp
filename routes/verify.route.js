// Initialize express router
const express = require('express');
const router = express.Router();

// initialize controller
const userController = require('../controllers/user.controller');

// define routes
router.get('/verify-email', userController.updateVerif);
router.post('/verify-forgot-password', userController.forgotPasswordVerify);

// export router
module.exports = router;