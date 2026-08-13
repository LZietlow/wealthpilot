
import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {pool} from '../config/db'

const router = express.Router();



router.get('/', authenticateToken, async(req, res) => {
    var user_id = (req as any).userId;
    console.log("test" + user_id);
    
    try {
        const response = await pool.query('SELECT transactions.* FROM transactions JOIN accounts ON transactions.account_id = accounts.id WHERE accounts.user_id = $1', [user_id]);
        res.json({transactions: response.rows})

    } catch (error) {
        res.status(401).json({message: "UserId undefined"})
    }
})

router.post('/', authenticateToken, async(req, res) => {
    const account_id = req.body.account_id;
    const amount = req.body.amount;
    const description = req.body.description;

    try {
        const response = await pool.query('INSERT INTO transactions (account_id, amount, description) VALUES ($1, $2, $3) RETURNING *', [account_id, amount, description])
        res.status(201).json({transaction: response.rows[0]});
    } catch (error) {
        res.status(500).json({error: error})
    }

})

export default router;