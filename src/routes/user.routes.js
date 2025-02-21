import express from 'express';
import { changePassword, loggedUser, loginUser, logoutUser, refreshPage, registerUser, updateAvatar, updateUserInfo } from '../controllers/user.controllers.js';
import { verifyToken } from '../middlewares/verifyToken.middleware.js';
import { upload } from '../middlewares/multer.middlewares.js';


const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout',verifyToken, logoutUser);

router.get('/refresh',verifyToken, refreshPage);
router.get('/user',verifyToken,loggedUser);

// protected route
router.patch('/update-User-info', verifyToken, updateUserInfo);
router.put('/update-avatar', verifyToken,upload.single('avatar'), updateAvatar);
router.post('/change-password',verifyToken, changePassword);
export default  router;