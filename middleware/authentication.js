import * as dotenv from 'dotenv';
import UserModel from '../models/User.model.js'
import jwt from 'jsonwebtoken';
import {UnauthenticatedError} from '../errors/index.js'

dotenv.config();

const AuthenticatorMiddleware=(req,res,next)=>{
    let token=req.headers.authorization;

    if(!token || !token.startsWith('Bearer ')){
        throw (new UnauthenticatedError('Invalid Token'))
    }
    try{
        token=token.split(' ')[1];
        const payload=jwt.verify(token,process.env.JWT_SECRET);
        req.user = { userId: payload.userId, name: payload.name }
        next();
    }catch(error){
        throw (new UnauthenticatedError('Invalid Token'))
    }
}

export default AuthenticatorMiddleware