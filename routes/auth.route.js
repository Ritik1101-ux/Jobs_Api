import express from 'express';
import { login, register } from '../controllers/auth.controller.js';


const AuthRouer= express.Router();


AuthRouer.route('/register').post(register);
AuthRouer.route('/login').get(login);

export default AuthRouer;