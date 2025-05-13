import express from 'express';
import { changePassword, deleteUserById, getAllUser, loggedUser, loginUser, logoutUser, refreshPage, registerUser, updateAvatar, updateUserInfo } from '../controllers/user.controllers.js';
import { verifyToken } from '../middlewares/verifyToken.middleware.js';
import { upload } from '../middlewares/multer.middlewares.js';
import verifyAdmin from '../middlewares/verifyAdmin.middleware.js';



const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout',verifyToken, logoutUser);

router.get('/refresh',verifyToken, refreshPage);
router.get('/user',verifyToken,loggedUser);

// protected route
router.get('/all-users',verifyToken,verifyAdmin,getAllUser);
router.post('/change-password',verifyToken, changePassword);
router.patch('/update-User-info', verifyToken, updateUserInfo);
router.put('/update-avatar', verifyToken,upload.single('avatar'), updateAvatar);
router.delete('/delete-user/:userId', verifyToken,verifyAdmin,deleteUserById);

export default  router;