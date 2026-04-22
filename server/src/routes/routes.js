import express from 'express';
import { login, register, getUsers, verifyJWT, logout } from '../controller/authController.js';

const router = express.Router();

router.post('/login', login)
router.post('/register', register)
router.get('/users', getUsers)
router.get('/me', verifyJWT)
router.get('/logout', logout)



export default router;