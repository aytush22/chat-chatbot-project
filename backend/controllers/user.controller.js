import bcrypt from 'bcrypt';
import userModel from '../models/user.model.js';
import { OAuth2Client } from "google-auth-library";
import * as userService from '../services/user.service.js';
import { validationResult } from 'express-validator';
import redisClient from '../services/reddis.service.js';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const createUserController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { //if errors not empty 
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await userService.createUser(req.body);
        const token = await user.generateJWT();
        delete user._doc.password;
        res.status(201).json({ user, token });
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

export const loginController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });

    }
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                errors: "Invalid Credentials"
            })
        }

        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                errors: "Invalid credentials"
            })
        }

        const token = await user.generateJWT();
        delete user._doc.password;
        res.status(200).json({ user, token });
    }
    catch (err) {
        res.status(400).send(err.message);
    }
}

export const profileController = async (req, res) => {
    console.log(req.user);
    res.status(200).json({
        user: req.user
    });
}

export const logoutController = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];
        redisClient.set(token, 'logout', 'EX', 60 * 60 * 24);
        res.status(200).json({
            message: "Loggout out successfully"
        });
    }
    catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
}
//for googlelogin validaations...
export const googleLoginController = async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { email } = ticket.getPayload();

        let user = await userModel.findOne({ email });
        if (!user) {
            const hashedPassword = await bcrypt.hash('google-auth', 10);
            user = new userModel({ email, password: hashedPassword });
            await user.save();
        }

        const jwtToken = await user.generateJWT();

        res.cookie("token", jwtToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: "Strict" });
        res.json({ message: "Google login successful", token: jwtToken });

    } catch (error) {
        console.error("Google login failed:", error);
        res.status(500).json({ error: "Google login failed" });
    }
};
