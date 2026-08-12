import { response } from "express";
import bcrypt from "bcrypt";
import { pool } from "../config/db";
import express from 'express'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
const router = express.Router();
import { authenticateToken } from "../middleware/authMiddleware";


router.get('/', authenticateToken, async(req, res) => {
    console.log('req.userId in Route:', (req as any).userId);
    console.log('body:', req.body)
    var userId = (req as any).userId;

    if(userId != undefined) {
        var accounts = await pool.query('SELECT * FROM accounts WHERE user_id = $1', [userId]);
        res.json({accounts: accounts.rows});
    } else {
        res.status(401).json({message: "UserId undefined"})
    }
})

export default router;