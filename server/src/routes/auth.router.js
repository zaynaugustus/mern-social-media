import express from "express";
import {
    register,
    login,
} from '../controllers/auth.controller.js';

const auth = express.Router(); // <--

// auth.post('/register', register);
auth.post('/login', login);

export default auth;