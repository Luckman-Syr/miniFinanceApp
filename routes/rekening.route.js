// Initialize express router
const express = require('express');
const router = express.Router();

// initialize controller
const rekeningController = require('../controllers/rekening.controller');
const verifyToken = require('../middlewares/verifyToken');
// define routes
router.post('/create-rekening', verifyToken, rekeningController.create);

// export router
module.exports = router;