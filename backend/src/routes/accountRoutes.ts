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

router.delete('/:id', authenticateToken, async(req, res) => {
    const accountId = req.params.id;
    const userId = (req as any).userId;

    try {
        const result = await pool.query('DELETE FROM accounts WHERE id = $1 AND user_id = $2 RETURNING *', [accountId, userId]);
        if(result.rows.length === 0) {;
            res.status(404).json({message: 'No matching account found'})
            return;
        }
        res.status(200).json({message: 'Account deleted succesfully'});
    } catch (error) {
        res.status(500).json({message: 'Could not delete account'});
    }
})

router.patch('/:id', authenticateToken, async(req, res) => {
    const accountId = req.params.id;
    const userId = (req as any).userId;
    var account;
    try {
        account = await pool.query('SELECT * FROM accounts WHERE id = $1 AND user_id = $2', [accountId, userId]);
        if(account.rows.length === 0) {
            res.status(404).json({message: 'No matching account found'})
            return;
        }
    } catch (error) {
        res.status(400).json({message: 'Could not find account'})
        return;
    }
    const newName = req.body.name || account.rows[0].name;
    const newBalance = req.body.balance !== undefined ? req.body.balance : account.rows[0].balance;

    try {
        const updatedAccount = await pool.query('UPDATE accounts SET name = $1, balance = $2 WHERE id = $3 AND user_id = $4 RETURNING *', [newName, newBalance, accountId, userId]);
        res.status(200).json({message: 'account succesfully updated', account: updatedAccount.rows[0]});
    } catch (error) {
        res.status(500).json({message: 'could not update account'});
    }

})

export default router;