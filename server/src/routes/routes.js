import express from 'express';
import { login, register, getUsers, verifyJWT, logout, getChats, verifyToken } from '../controller/authController.js';

const router = express.Router();

router.post('/login', login)
router.post('/register', register)
router.get('/users', getUsers)
router.get('/me', verifyJWT)
router.get('/logout', logout)
router.get('/getChats', verifyToken, getChats)

export default router;