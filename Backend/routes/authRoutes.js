const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authController = require('../controllers/authController'); 
const { verifyToken } = require('../middleware/auth'); 

const profileUploadDir = process.env.RENDER ? '/tmp/profiles' : path.join(__dirname, '../../uploads/profiles/');
const fs = require('fs');
if (!fs.existsSync(profileUploadDir)) {
    fs.mkdirSync(profileUploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, profileUploadDir); },
    filename: (req, file, cb) => {
        cb(null, 'profile-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        const allowed = /\.(jpg|jpeg|png|gif|webp)$/i;
        if (allowed.test(path.extname(file.originalname)) && file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files (jpg, png, gif, webp) are allowed'));
        }
    }
});

router.post('/register', authController.register); 
router.post('/login', authController.login); 
router.post('/update-profile', verifyToken, upload.single('profileImg'), authController.updateProfile);

module.exports = router;