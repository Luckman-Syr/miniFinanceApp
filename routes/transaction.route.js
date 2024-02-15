// Initialize express router
const express = require('express');
const router = express.Router();

// initialize controller
const transactionController = require('../controllers/transaction.controller');
const verifyToken = require('../middlewares/verifyToken');

// define routes
router.post('/transfer', verifyToken, transactionController.create);

// export router
module.exports = router;