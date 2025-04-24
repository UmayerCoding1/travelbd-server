import express from 'express';
import verifyAdmin from '../middlewares/verifyAdmin.middleware.js';
import { addlocation } from '../controllers/admin.controllers.js';
import { verifyToken } from '../middlewares/verifyToken.middleware.js';
import { getAllUser } from '../controllers/user.controllers.js';


const router = express.Router();

router.post('/admin/add-location',verifyToken, verifyAdmin, addlocation);
router.get('/all-users',verifyToken,verifyAdmin,getAllUser);

export default(router);
