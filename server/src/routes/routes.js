import express from 'express';
import { login, register, getUsers, verifyJWT } from '../controller/authController.js';

const router = express.Router();

router.post('/login', login)
router.post('/register', register)
router.get('/users', getUsers)
router.get('/me', verifyJWT)



export default router;