import { response } from "express";
import bcrypt from "bcrypt";
import { pool } from "../config/db";
import express from 'express'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
const router = express.Router();



router.post('/register', async (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    try {
        var hashed_password = await bcrypt.hash(password, 10);
        var userId_email = await pool.query('insert into users (email, password_hash) values ($1, $2) returning id, email', [email, hashed_password]);

        res.status(201).json({userId: userId_email.rows[0].id, email: userId_email.rows[0].email})
    } catch (error) {
        console.error(error)
        res.status(409).json({status: 'error', message: error})
    }
    
    
});

router.post('/login', async (req, res) => {
    var email = req.body.email;

    try {
        var userfound = await pool.query('select * from users where email = $1', [email]);
        if(userfound.rows.length === 0) {
            res.status(401).json({message: "User with that Email doesn't exist"});
            return;
        }
        var user = userfound.rows[0];
        console.log('User gefunden:', user);
        var passwordCheck = await bcrypt.compare(req.body.password, user.password_hash);

        if(passwordCheck != true) {
            res.status(401).json({message: "Password is incorrect"});
            return;
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET not defined');
        }
        console.log('Payload vor jwt.sign:', { userId: user.id });
        var token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, {expiresIn: '1h'})
        console.log('JWT_SECRET beim Login:', process.env.JWT_SECRET);
        console.log('Secret (Login):', JSON.stringify(process.env.JWT_SECRET));
        res.status(200).json({token: token})

    } catch (error) {
        console.error("error: ", error)
        res.status(500).json({message: error})
    }
})


export default router;