import { response } from "express";
import bcrypt from "bcrypt";
import { pool } from "../config/db";
import express from 'express'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
const router = express.Router();
import { authenticateToken } from "../middleware/authMiddleware";


router.get('/', authenticateToken, async(req, res) => {
    //console.log('req.userId in Route:', (req as any).userId);
    //console.log('body:', req.body)
    var userId = (req as any).userId;

    if(userId != undefined) {
        var accounts = await pool.query('SELECT * FROM accounts WHERE user_id = $1', [userId]);
        res.json({accounts: accounts.rows});
    } else {
        res.status(401).json({message: "UserId undefined"})
    }
})

router.post('/', authenticateToken, async(req, res) => {
    var name = req.body.name;
    var userId = (req as any).userId;

    var balance = 0;
    if(req.body.balance != undefined) {
        balance = req.body.balance;
    }
    var account
    try {
         account = await pool.query('INSERT INTO accounts (user_id, name, balance) VALUES ($1, $2, $3) RETURNING *', [userId, name, balance]);
         res.status(201).json({message: 'account created succesfully', account: account.rows[0]});
    } catch (error) {
        res.status(400).json({message: 'Could not create new account'})
        console.log(error)
    }
    

})

export default router;