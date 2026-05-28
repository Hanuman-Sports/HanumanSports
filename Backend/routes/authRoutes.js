const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authController = require('../controllers/authController'); 
const { verifyToken } = require('../middleware/auth'); 

const profileUploadDir = process.env.VERCEL === '1' ? '/tmp/profiles' : './uploads/profiles/';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, profileUploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, 'profile-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.post('/register', authController.register); 
router.post('/login', authController.login); 
router.post('/update-profile', verifyToken, upload.single('profileImg'), authController.updateProfile);

module.exports = router;