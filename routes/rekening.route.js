// Initialize express router
const express = require('express');
const router = express.Router();

// initialize controller
const rekeningController = require('../controllers/rekening.controller');

// define routes
router.post('/create-rekening', rekeningController.create);

// export router
module.exports = router;