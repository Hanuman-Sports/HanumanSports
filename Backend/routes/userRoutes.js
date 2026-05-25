const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth'); // Ensure this file exists and is correct

// Line 6: Ensure userController.updateProfile matches the export name above
router.put('/profile/update', verifyToken, userController.updateProfile);
router.post('/profile/change-password', verifyToken, userController.changePassword);

module.exports = router;