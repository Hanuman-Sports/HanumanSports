const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');
router.put('/profile/update', verifyToken, userController.updateProfile); 
router.post('/profile/change-password', verifyToken, userController.changePassword);

module.exports = router;