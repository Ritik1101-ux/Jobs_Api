import { StatusCodes } from "http-status-codes";
import UserModel from "../models/User.model.js"
import bcrypt from "bcrypt";
import { UnauthenticatedError, BadRequestError } from '../errors/index.js'


const register = async (req, res) => {

    const { name, email, password } = req.body;

    const user = await UserModel.create({ name, email, password });
    const token = user.createJWT();

    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });

}

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw (new BadRequestError('Please Provide Email and password'))
    }
    const user = await UserModel.findOne({ email });

    if (!user) {
        throw (new UnauthenticatedError('Invalid Credentials'))
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
        throw (new UnauthenticatedError('Invalid Credentials'))
    }

    const token = user.createJWT();

    res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
}

export { register, login }